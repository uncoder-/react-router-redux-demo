import React from 'react';
import ReactDOM from 'react-dom';
import RenderView from './render.jsx';
import ControlPanel from './control.jsx';
import Style from './index.css';
class CanvasView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            url: this.props.url,
            actionName: '',
            drawStatus: 0
        }
        this.init = {
            canvasUrl :'',
            historyDraw: []
        }
    }
    checkStatus(args) { 
        // console.log(args); 
        this.setState({
            actionName: args.actionName,
            drawStatus: args.status
        })
    }
    finishDraw(args){
        this.init = {
            historyDraw:[],
            canvasUrl:''
        }
    }
    render() {
        // console.log(this.state)
        return (
            <div className="canvas-container">
                <RenderView
                    url = {this.state.url}
                    actionName = {this.state.actionName}
                    drawStatus = {this.state.drawStatus == 0?false:true}
                    onFinishDraw = {e=>this.finishDraw(e)}
                />
                <ControlPanel onClick={e=>this.checkStatus(e)} />
            </div>
        )
    }
}

export default CanvasView;