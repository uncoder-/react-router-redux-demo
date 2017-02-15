import React from 'react';
import ReactDOM from 'react-dom';
import Style from './index.css';
class RenderView extends React.Component{
	constructor(props){
		super(props);
        const {drawStatus,actionName} = this.props;
        this.init = {
            drawStatus: drawStatus,
            actionName: actionName,
            click: false,
            start:{
                x: 0,
                y: 0
            },
            move:{
                x: 0,
                y: 0
            },
            imgInfo:{
                height: 0,
                width: 0
            },
            myCanvas:'',
            myCtx:'',
            canvasConfig:{
                fillStyle: "red",
                font: "60px ooxx",
                strokeStyle: "red",
                lineWidth: 5
            },
            canvasUrl: '',
            historyList: []
        };
        this.state = {
             inputStatus: false,
             inputPosition:{
                 left: 0,
                 top: 0,
                 x: 0,
                 y: 0
             }
        }
	}
    onmousedown(e){
        let start = this.getCanvasPoint.call(this,e);
        this.init.click = true;
        // 不画
        if(this.init.drawStatus){ return;}
        // 可以画
        const actionName = this.init.actionName;
        if(actionName == "drawRight"||actionName == "drawHalfRight"||actionName == "drawWrong"){
            this.drawTag(actionName,start.x,start.y);
        }else if(actionName == "drawRect"){
            this.init.start.x = start.x;
            this.init.start.y = start.y;
        }else if(actionName == "drawText"){
            let pp = this.getPosition(e);
            this.setState({
                inputStatus: true,
                inputPosition: {
                    x: start.x,
                    y: start.y,
                    left: pp.x,
                    top: pp.y
                }
            });
            // 清空输入
            ReactDOM.findDOMNode(this.refs.myInput).children[0].value = "";
        }
    }
    onmousemove(e){
        if(this.init.click && this.init.actionName == "drawRect"){
            let move = this.getCanvasPoint.call(this,e);
            this.init.move.x = move.x;
            this.init.move.y = move.y;
            // 画框
            this.drawRect();
        }
    }
    onmouseup(e){
        if(this.init.click && this.init.actionName == "drawRect"){
            this.drawRect(true);
            // 保存图片数据
            this.autoSaveImage();
        }
        this.init.click = false;
        this.move = { x:0, y:0};
        this.start = { x:0, y:0};
    }
    // 标记
    drawTag(tag,x,y){
        let myCtx = this.init.myCtx;
        let pic_url = '';
        if(tag == "drawRight"){
            pic_url = this.refs.tagRight;
        }else if(tag == "drawHalfRight"){
            pic_url = this.refs.tagHalfRight;
        }else if(tag == "drawWrong"){
            pic_url = this.refs.tagWrong;
        }
        myCtx.drawImage(pic_url,x-35,y-35,75,75);
        this.recordHistory({
            actionName: this.init.actionName,
            img_url: pic_url,
            x: x-35,
            y: y-35,
            width: 75,
            height: 75
        })
    }
    // 画框
    drawRect(args){
        let {start,move} = this.init;
        let width = Math.abs(move.x-start.x);
        let height = Math.abs(move.y-start.y);
        let myCtx = this.init.myCtx;
        // 清空画布        
        myCtx.clearRect(0,0,this.init.imgInfo.width,this.init.imgInfo.height);
        // 背景
        let bgImage = new Image();
        bgImage.src = this.init.canvasUrl;
        myCtx.drawImage(bgImage,0,0,this.init.imgInfo.width,this.init.imgInfo.height);
        myCtx.strokeStyle = this.init.canvasConfig.strokeStyle;
        myCtx.lineWidth = this.init.canvasConfig.lineWidth;
        myCtx.strokeRect(start.x,start.y,width,height);
        if(args){
            this.recordHistory({
                actionName: this.init.actionName,
                x: start.x,
                y: start.y,
                width: width,
                height: height
            })
        }
    }
    // 写字
    drawText(str){
        let myCtx = this.init.myCtx;
        const {inputPosition} = this.state;
        myCtx.fillStyle = this.init.canvasConfig.fillStyle;
        myCtx.font = this.init.canvasConfig.font;
        myCtx.fillText(str,inputPosition.x,inputPosition.y);
        this.setState({
            inputStatus: false
        })
        this.recordHistory({
            actionName: this.init.actionName,
            x: inputPosition.x,
            y: inputPosition.y,
            text: str
        })
    }
    // 重新绘制
    drawHistory(){
        let drawList = this.init.historyList;
        drawList.pop();
        let revokeList = drawList;

        let myCtx = this.init.myCtx;
        // 清空画布        
        myCtx.clearRect(0,0,this.init.imgInfo.width,this.init.imgInfo.height);
        // 背景
        let bgImage = new Image();
        bgImage.src = this.props.url;
        let that = this;
        bgImage.onload = function(){
            myCtx.drawImage(bgImage,0,0,that.init.imgInfo.width,that.init.imgInfo.height);
            revokeList.map(function(item,index){
                const {actionName,x,y} = item;
                if(actionName == "drawRight"||actionName == "drawHalfRight"||actionName == "drawWrong"){
                    myCtx.drawImage(item.img_url,x,y,item.width,item.width);
                }else if(actionName == "drawRect"){
                    myCtx.strokeRect(x,y,item.width,item.height);
                }else if(actionName == "drawText"){
                    myCtx.fillText(item.text,x,y);
                }
            });
        }
        this.init.historyList = revokeList;
    }
    // 清空
    clearHistory(){
        let myCanvas = this.refs.myCanvas;
        let myCtx = myCanvas.getContext('2d');

        let bgImage = new Image();
        bgImage.src = this.props.url;
        let that = this;
        bgImage.onload = function(){
            myCtx.drawImage(bgImage,0,0,that.init.imgInfo.width,that.init.imgInfo.height);
        }
        this.init.historyList = [];
    }
    // 计算页面点击位置
    getPosition(event){
        let target = event.target;
        // 视窗偏移量
        const offsetLeft = target.offsetLeft;
        const offsetTop = target.offsetParent.offsetTop;
        // canvas缩放后的尺寸
        const offsetHeight = target.offsetHeight;
        const offsetWidth = target.offsetWidth;
        // canvas滚动的高度
        let scrollHeight = target.parentNode.scrollTop;
        // 窗口的滚动高度
        let windowScrollHeight = window.document.body.scrollTop;
        // 点击位置
        var eventX = event.clientX;
        var eventY = event.clientY;
        // console.log(this);
        // console.log(offsetLeft,offsetTop,offsetHeight,offsetWidth,eventX,eventY)
        // 相对位置
        var canvasPointX = eventX-offsetLeft
        var canvasPointY = eventY-offsetTop+scrollHeight+windowScrollHeight
        // console.log({x:canvasPointX,y:canvasPointY});
        return {x:canvasPointX,y:canvasPointY}
    }
    // 计算canvas位置
    getCanvasPoint(event){
        let target = event.target;
        // 视窗偏移量
        const offsetLeft = target.offsetLeft;
        const offsetTop = target.offsetParent.offsetTop;
        // canvas缩放后的尺寸
        const offsetHeight = target.offsetHeight;
        const offsetWidth = target.offsetWidth;
        // canvas滚动的高度
        let scrollHeight = target.parentNode.scrollTop;
        // 窗口的滚动高度
        let windowScrollHeight = window.document.body.scrollTop;
        // 点击位置
        var eventX = event.clientX;
        var eventY = event.clientY;
        // console.log(this);
        // console.log(offsetLeft,offsetTop,offsetHeight,offsetWidth,eventX,eventY)
        // 相对位置
        var canvasPointX = ((eventX-offsetLeft)/offsetWidth)*this.init.imgInfo.width;
        var canvasPointY = ((eventY-offsetTop+scrollHeight+windowScrollHeight)/offsetHeight)*this.init.imgInfo.height;
        //console.log({x:canvasPointX,y:canvasPointY});
        return {x:canvasPointX,y:canvasPointY}
    }
    // 记录历史
    recordHistory(obj){
        this.init.historyList.push(obj);
    }
    // 自动保存
    autoSaveImage(){
        let canvas = this.refs.myCanvas;
        let currentImg = canvas.toDataURL("image/png");
        this.init.canvasUrl = currentImg;
        this.props.onFinishDraw({
            canvasUrl:currentImg
        });
        this.props.onFinishDraw(currentImg);
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.actionName == "reset"){
            console.log("清空");
            this.clearHistory();
        }else if(nextProps.actionName == "revoke"){
            console.log("撤销");
            this.drawHistory();
        }
        // console.log(nextProps)
        this.init.drawStatus = nextProps.drawStatus;
        this.init.actionName = nextProps.actionName;  
        // 保存图片数据
        this.autoSaveImage();
        // 重置数据
        this.init.click = false;
    }
	componentDidMount(){
        let that = this;
        // 获取canvas
        let myCanvas = ReactDOM.findDOMNode(this.refs.myCanvas);
        let myCtx = myCanvas.getContext('2d');
        myCtx.save();
        myCtx.fillStyle = "blue";
        myCtx.save();
        this.init.myCanvas = myCanvas;
        this.init.myCtx = myCtx;

        // 绘制底图
        let bgImage = new Image();
        bgImage.src = this.props.url;
        // console.dir(bgImage)
        bgImage.crossOrigin = "Anonymous";
        bgImage.onload = function(){
            that.init.imgInfo = {
                height: this.height,
                width: this.width
            }
            myCanvas.setAttribute('height',this.height);
            myCanvas.setAttribute('width',this.width);
            myCtx.drawImage(this,0,0,this.width,this.height);
        }
        ReactDOM.findDOMNode(this.refs.myInput).addEventListener('keydown',(e)=>{
            let theEvent = e || window.event;
            let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            if (code == 13) {
                //回车执行查询
                console.log('回车触发');
                let text = theEvent.target.value;
                that.drawText(text);
            }
        })
    }
    render(){
        return (
            <div className="draw-canvas">
                <canvas 
                    height="500" 
                    width="500" 
                    ref="myCanvas"
                    onMouseDown={e=>this.onmousedown(e)}
                    onMouseMove={e=>this.onmousemove(e)}
                    onMouseUp={e=>this.onmouseup(e)}
                ></canvas>
                <div className="pre-load">
                    <img src={require("./img/tool1_draw.png")} ref="tagRight"/>
                    <img src={require("./img/tool3_draw.png")} ref="tagHalfRight"/>
                    <img src={require("./img/tool2_draw.png")} ref="tagWrong"/>
                </div>
                <div className="pre-input" 
                    ref="myInput" 
                    style={{
                        display:this.state.inputStatus?"block":"none",
                        left:this.state.inputPosition.left,
                        top:this.state.inputPosition.top
                    }}>
                    <input type="text" placeholder="最多50个字"/>
                </div>
            </div>
        )
    }   
}

export default RenderView;