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
            canvasUrl:''
        };
	}
    onmousedown(e){
        let start = this.getPosition(e);
        this.init.click = true;
        // 不能画
        if(this.init.drawStatus){
            console.log(e);
            return;
        }
        const actionName = this.init.actionName;
        if(actionName == "drawRight"||actionName == "drawHalfRight"||actionName == "drawWrong"){
            this.drawTag(actionName,start.x,start.y);
        }else if(actionName == "drawRect"){
            this.init.start.x = start.x;
            this.init.start.y = start.y;
        }else if(actionName == "drawText"){
            
        }else if(actionName == "reset"||actionName == "revoke"){
            console.log("清空或者撤销");
            //drawHistory(myCtx);
        }
    }
    onmousemove(e){
        if(this.init.click && this.init.actionName == "drawRect"){
            let move = this.getPosition(e);
            this.init.move.x = move.x;
            this.init.move.y = move.y;
            // 画框
            this.drawRect();
        }
    }
    onmouseup(e){
        if(this.init.click && this.init.actionName == "drawRect"){
            this.drawRect();
            // 保存图片数据
            this.autoSaveImage();
        }
        this.init.click = false;
        this.move = { x:0, y:0};
        this.start = { x:0, y:0};
    }
    drawTag(tag,x,y){
        let myCanvas = this.refs.myCanvas;
        let myCtx = myCanvas.getContext('2d');
        let pic_url = '';
        if(tag == "drawRight"){
            pic_url = this.refs.tagRight
        }else if(tag == "drawHalfRight"){
            pic_url = this.refs.tagHalfRight
        }else if(tag == "drawWrong"){
            pic_url = this.refs.tagWrong
        }
        myCtx.drawImage(pic_url,x-20,y-25,50,50);
    }
    drawRect(){
        let {start,move} = this.init;
        let width = Math.abs(move.x-start.x);
        let height = Math.abs(move.y-start.y);
        let myCanvas = this.refs.myCanvas;
        let myCtx = myCanvas.getContext('2d');
        
        myCtx.clearRect(0,0,500,500);

        let bgImage = new Image();
        bgImage.src = this.init.canvasUrl;
        myCtx.drawImage(bgImage,0,0,500,500);
        myCtx.strokeStyle = 'red';
        myCtx.strokeRect(start.x,start.y,width,height);
    }
    drawHistory(myCtx){
        let data = this.props.history;
    }
    getPosition(evt){
        let rect = evt.target.getBoundingClientRect();
        return {
            x:evt.clientX - rect.left,
            y:evt.clientY - rect.top
        }
    }
    componentWillReceiveProps(nextProps){
        console.log(nextProps)
        this.init.drawStatus = nextProps.drawStatus;
        this.init.actionName = nextProps.actionName;
        // 保存图片数据
        this.autoSaveImage();
    }
    autoSaveImage(){
        let canvas = this.refs.myCanvas;
        let currentImg = canvas.toDataURL("image/png");
        this.init.canvasUrl = currentImg;
        this.props.onFinishDraw({
            canvasUrl:currentImg
        });
    }
	componentDidMount(){
        // 获取基本信息
        const {url} = this.props;
        let myCanvas = ReactDOM.findDOMNode(this.refs.myCanvas);
        let myCtx = myCanvas.getContext('2d');
        // 绘制底图
        let bgImage = new Image();
        bgImage.src = url;
        bgImage.crossOrigin = "Anonymous";
        bgImage.onload = function(){
            myCtx.drawImage(bgImage,0,0,this.width,this.height);
        }
        return true;
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
            </div>
        )
    }   
}

export default RenderView;