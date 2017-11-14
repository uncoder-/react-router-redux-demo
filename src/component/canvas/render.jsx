import React from 'react';
import ReactDOM from 'react-dom';

import Style from './index.css';

class RenderView extends React.Component{
	constructor(props){
		super(props);
        const { drawStatus, actionName } = this.props;
        this.init = {
            imageLoadSuccess: false,
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
                width: 500,
                height: 500
            },
            canvasConfig:{
                fillStyle: "#FF6337",
                strokeStyle: "#FF6337",
                font: "30px ooxx",
                lineWidth: 3
            },
            originUrl: '',
            canvasPixesData: '',
            markList: []
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
        // 不画
        if(this.init.drawStatus || !this.init.imageLoadSuccess){
            e.preventDefault();
            return;
        }
        let start = this.getCanvasPoint.call(this,e);
        this.init.click = true;
        // 可以画
        const actionName = this.init.actionName;
        if (actionName == "drawRight" || actionName == "drawHalfRight" || actionName == "drawWrong") {
            this.drawTag(actionName, start.x, start.y);
        } else if (actionName == "drawRect") {
            this.init.start = {
                x: start.x,
                y: start.y
            }
        } else if (actionName == "drawText") {
            this.setState({
                inputStatus: true,
                inputPosition: {
                    x: start.x,
                    y: start.y,
                    left: start.left,
                    top: start.top
                }
            });
            // 清空输入,自动对焦
            let myInput = ReactDOM.findDOMNode(this.refs.myInput).children[0];
            setTimeout(function () {
                myInput.focus();
            }, 0)
        }
    }
    onmousemove(e){
        if(this.init.click && this.init.actionName == "drawRect"){
            let move = this.getCanvasPoint.call(this,e);
            this.init.move = { x: move.x, y: move.y }
            // 画框
            this.drawRect();
        }
    }
    onmouseup(e){
        if(this.init.click && this.init.actionName == "drawRect"){
            this.drawRect(true);
        }
        // 保存图片数据
        this.autoSaveImage();
        // 重置
        this.resetAction();
    }
    onmouseout(e){
        if(this.init.click && this.init.actionName == "drawRect"){
            this.drawRect(true);
            // 保存图片数据
            this.autoSaveImage();
        }
        // 重置
        this.resetAction();
    }
    // 标记
    drawTag(tag, x, y){
        let myCanvas = this.refs.myCanvas;
        let myCtx = myCanvas.getContext('2d');
        let imgUrl = '';
        if(tag == "drawRight"){
            imgUrl = this.refs.tagRight;
        }else if(tag == "drawHalfRight"){
            imgUrl = this.refs.tagHalfRight;
        }else if(tag == "drawWrong"){
            imgUrl = this.refs.tagWrong;
        }
        myCtx.drawImage(imgUrl, x - 25, y - 25, 76, 50);
        this.recordHistory({
            actionName: tag,
            imgUrl: imgUrl,
            x: x-25,
            y: y-25,
            width: 76,
            height: 50
        })
    }
    // 画框
    drawRect(args){
        let {start, move ,imgInfo, canvasConfig} = this.init;
        if(move.x >= 5 || move.y >= 5){
            let width = Math.abs(move.x - start.x);
            let height = Math.abs(move.y - start.y);

            let myCanvas = this.refs.myCanvas;
            let myCtx = myCanvas.getContext('2d');
            // 背景
            myCtx.putImageData(this.init.canvasPixesData, 0, 0);
            myCtx.strokeStyle = canvasConfig.strokeStyle;
            myCtx.lineWidth = canvasConfig.lineWidth;
            let drawRectData = { x: 0, y: 0 };
            if (start.x < move.x && start.y < move.y) {
                // 右下
                drawRectData = {x:start.x, y:start.y};
                myCtx.strokeRect(start.x, start.y, width, height);
            } else if (start.x < move.x && start.y > move.y) {
                // 右上
                drawRectData = {x:start.x,y:start.y-height};
                myCtx.strokeRect(start.x, start.y-height, width, height);
            } else if (start.x > move.x && start.y < move.y) {
                // 左下
                drawRectData = {x:start.x-width,y:start.y};
                myCtx.strokeRect(start.x-width, start.y, width, height);
            } else if (start.x > move.x && start.y > move.y) {
                // 左上
                drawRectData = {x:start.x-width,y:start.y-height};
                myCtx.strokeRect(start.x-width, start.y-height, width, height);
            }
            if(args){
                this.recordHistory({
                    actionName: 'drawRect',
                    x: drawRectData.x,
                    y: drawRectData.y,
                    width: width,
                    height: height
                })
            }
        }
    }
    // 写字
    drawText(str){
        let myCanvas = this.refs.myCanvas;
        let myCtx = myCanvas.getContext('2d');
        const {inputPosition} = this.state;
        myCtx.fillStyle = this.init.canvasConfig.fillStyle;
        myCtx.font = this.init.canvasConfig.font;
        // 处理多行文本
        const fooText = this.fooText(str);
        for(let i=0;i<fooText.length;i++){
            myCtx.fillText(fooText[i],inputPosition.x-30,inputPosition.y+i*33);
        }
        this.recordHistory({
            actionName: 'drawText',
            x: inputPosition.x,
            y: inputPosition.y,
            text: str
        })
        this.autoSaveImage();
    }
    // 多行文本
    fooText(str){
        let arry = [];
        let doArry = str.split('');
        let { width } = this.init.imgInfo;
        let { x } = this.state.inputPosition;
        let one = width - x < 50 ? 50 : width - x - 50;
        let strWidth = 0;
        // console.info(doArry);
        for (let i = 0; i < doArry.length; i++) {
            // 中文30宽度，西文15宽         
            let lg = doArry[i].charCodeAt() > 255 ? 30 : 10;
            // console.log(strWidth)
            if(strWidth < one){
                strWidth = strWidth + lg;
            } else {
                // console.log(strWidth,one);
                arry.push(i);
                strWidth = 0;
            }
        }
        let strArry = [];
        for (let j = 0; j < arry.length; j++) {
            if(j == 0){
                strArry.push(doArry.slice(0, arry[0]).join(''))
            }
            strArry.push(doArry.slice(arry[j], arry[j + 1]).join(''))
        }
        // 若长度够
        if (strArry.length <= 0) {
            strArry.push(doArry.join(''))
        }
        return strArry;
    }
    // 撤销绘制
    drawHistory(){
        let that = this;
        let drawList = this.init.markList;
        // 删除最后一个
        drawList.pop();
        let myCanvas = this.refs.myCanvas;
        let myCtx = myCanvas.getContext('2d');
        // 背景
        let bgImage = new Image();
        bgImage.crossOrigin = '*';
        bgImage.src = this.init.originUrl;
        bgImage.onload = function(){
            let { strokeStyle, fillStyle, lineWidth, font } = that.init.canvasConfig;
            let { width, height } = that.init.imgInfo;
            myCtx.drawImage(bgImage, 0, 0, width, height);
            drawList.map(function(item, index){
                const {actionName, x, y} = item;
                if (actionName == "drawRight" || actionName == "drawHalfRight" || actionName == "drawWrong") {
                    myCtx.drawImage(item.imgUrl, x, y, item.width, item.height);
                }else if(actionName == "drawRect"){
                    myCtx.strokeStyle = strokeStyle;
                    myCtx.lineWidth = lineWidth;
                    myCtx.strokeRect(x, y, item.width, item.height);
                }else if(actionName == "drawText"){
                    myCtx.fillStyle = fillStyle;
                    myCtx.font = font;
                    // 处理多行文本
                    const fooText = that.fooText(item.text);
                    for (let i = 0; i < fooText.length; i++) {
                        myCtx.fillText(fooText[i], x - 30, y + i * 33);
                    }
                }
            });
            that.init.markList = drawList;
            // console.log("保存成功");
            that.autoSaveImage();
        }
    }
    // 清空
    clearHistory(){
        // 清空历史动作
        this.init.markList = [];
        
        let that = this;
        let myCanvas = this.refs.myCanvas;
        let myCtx = myCanvas.getContext('2d');

        let bgImage = new Image();
        bgImage.crossOrigin = "*";
        bgImage.src = this.init.originUrl;
        bgImage.onload = function(){
            myCtx.drawImage(bgImage,0,0,that.init.imgInfo.width,that.init.imgInfo.height);
            that.autoSaveImage();
        }
        bgImage.onerror = function(){
            alert("笔记图片地址错误,后台返回的地址数据是:=>"+this.src);
        }
    }
    // 计算canvas位置
    getCanvasPoint(event){
        const target = event.target;
        // 视窗偏移量
        const targteRect = target.getBoundingClientRect();
        const targteParentRect = target.parentNode.getBoundingClientRect();
        // 内部滚动的高度
        const scrollHeight = target.parentNode.scrollTop;
        // 点击位置
        const eventX = event.clientX;
        const eventY = event.clientY;
        // canvas缩放后的尺寸
        const offsetHeight = target.offsetHeight;
        const offsetWidth = target.offsetWidth;
        // 相对位置
        const canvasPointX = ((eventX-targteRect.left)/offsetWidth)*this.init.imgInfo.width;
        const canvasPointY = ((eventY-targteRect.top)/offsetHeight)*this.init.imgInfo.height;
        //console.log({x:canvasPointX,y:canvasPointY});
        // 输入框偏移量,先判定宽度，在容错高度
        let offsetX = 0;
        let offsetY = 0;
        const drawCanvas = ReactDOM.findDOMNode(this.refs.drawCanvas);
        // console.dir(drawCanvas.offsetWidth,);
        if (offsetWidth > drawCanvas.offsetWidth) {
            if (offsetHeight < drawCanvas.offsetHeight) {
                offsetY = (drawCanvas.offsetHeight - offsetHeight) / 2;
            }
        }
        // console.log(offsetX, offsetY)
        return {
            // 相对
            x: canvasPointX, 
            y: canvasPointY,
            // 真实
            left: eventX-targteParentRect.left+offsetX,
            top: eventY-targteParentRect.top+offsetY+scrollHeight
        }
    }
    // 记录历史
    recordHistory(obj){
        this.init.markList.push(obj);
    }
    // 自动保存
    autoSaveImage(){
        try {
            let myCanvas = this.refs.myCanvas;
            let myCtx = myCanvas.getContext('2d');
            let { width, height } = this.init.imgInfo;
            let canvasPixesData = myCtx.getImageData(0, 0, width, height);
            this.init.canvasPixesData = canvasPixesData;
            // console.log("结果",this.init.markList);
            // 生成图片
            let canvasBase64Url = myCanvas.toDataURL("image/png");
            this.props.onFinishDraw({
                canvasUrl: canvasBase64Url,
                markList: this.init.markList,
                clearAction: this.init.actionName == "revoke" || this.init.actionName == "reset" ? true : false
            });
        } catch (error) {
            console.log(error);
            alert("保存图片的base64失败,有可能是跨域造成的！");
        }
    }
    // 重置点击数据
    resetAction(){
        this.init.click = false;
        this.init.start = { x:0, y:0};
        this.init.move = { x:0, y:0};
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.actionName == "reset"){
            // console.log("清空");
            this.clearHistory();
        }else if(nextProps.actionName == "revoke"){
            // console.log("撤销");
            this.drawHistory();
        }
        this.init.drawStatus = nextProps.drawStatus;
        this.init.actionName = nextProps.actionName;
        // 隐藏输入框
        if(this.state.inputStatus){
            this.setState({ inputStatus: false });
        }
        // 重置点击
        this.resetAction();
    }
	componentDidMount(){
        // console.log(this.props);
        if(!this.props.markId || this.props.markId.indexOf("undefined") >= 0){ return }
        let that = this;
        // 滚动到顶部
        this.refs.drawCanvas.scrollTop = 0;
        // loading占位图
        let myCanvas = this.refs.myCanvas;
        let myCtx = myCanvas.getContext('2d');
        // 加载提示语
        myCanvas.setAttribute('height', 500);
        myCanvas.setAttribute('width', 500);
        myCtx.clearRect(0, 0, 500, 500);
        myCtx.font = "30px xxoo";
        myCtx.fillText("图片加载中...", 150, 100);
        this.autoSaveImage();
        // 缓存笔记原图
        this.init.originUrl = this.props.originUrl;
        // 笔记图片加载状态
        this.init.imageLoadSuccess = false;
        // 绘制笔记
        let bgImage = new Image();
        bgImage.crossOrigin = "*";
        bgImage.src = this.props.currentUrl;
        bgImage.onload = function () {
            // 缓存原图尺寸
            that.init.imgInfo.width = this.width;
            that.init.imgInfo.height = this.height;
            that.init.imageLoadSuccess = true;
            myCanvas.setAttribute('height', this.height);
            myCanvas.setAttribute('width', this.width);
            myCtx.drawImage(this, 0, 0, this.width, this.height);
            // 保存
            that.autoSaveImage();
        }
        bgImage.onerror = function () {
            alert("笔记图片地址错误,后台返回的地址数据是:=>" + this.src);
        }
        // 注册输入框事件
        ReactDOM.findDOMNode(this.refs.myInput).addEventListener('keydown',(e)=>{
            let theEvent = e || window.event;
            let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
            let myInput = ReactDOM.findDOMNode(this.refs.myInput).children[0];
            if (code == 13) {
                // 回车
                let text = theEvent.target.value;
                that.setState({
                    inputStatus: false
                })
                if(text.length > 0){
                    that.drawText(text);
                }
                myInput.value = '';
            }else if(code == 27){
                // esc
                this.setState({
                    inputStatus: false
                })
                myInput.value = '';
            }
        });
    }
    render(){
        return (
            <div className="draw-canvas" ref="drawCanvas">
                <canvas
                    ref="myCanvas"
                    onMouseDown={e=>this.onmousedown(e)}
                    onMouseMove={e=>this.onmousemove(e)}
                    onMouseUp={e=>this.onmouseup(e)}
                    onMouseOut={e=>this.onmouseout(e)}
                ></canvas>
                <div className="pre-load">
                    <img src={require("./img/tool1_draw.png")} ref="tagRight" crossOrigin = "Anonymous"/>
                    <img src={require("./img/tool3_draw.png")} ref="tagHalfRight" crossOrigin = "Anonymous"/>
                    <img src={require("./img/tool2_draw.png")} ref="tagWrong" crossOrigin = "Anonymous"/>
                </div>
                <div className="pre-input" 
                    ref="myInput" 
                    style={{
                        display:this.state.inputStatus?"block":"none",
                        left:this.state.inputPosition.left,
                        top:this.state.inputPosition.top
                    }}>
                    <input type="text" placeholder="最多50个字" maxLength="50" />
                </div>
            </div>
        )
    }   
}

export default RenderView;
