import React from 'react';
import ReactDOM from 'react-dom';
import PDF from './PDF.jsx';
import VideoView from './video.jsx';
import CanvasView from './canvas/index.jsx';
class Section extends React.Component{
	constructor(props){
		super(props);
		this.state = {visibility:true}
	}
	getImageData(args){
		console.log(args);
	}
	render(){
		const visibility = {display:this.state['visibility']?'none':'block'}
		return (<div>
			section page!
			{/**pdf预览 */}
			{/*<div style={visibility}>
				<PDF src='http://localhost:8080/test09.pdf'/>
			</div>*/}
			{/*视频*/}
			{/*<div style={visibility}>
				<VideoView src='http://www.sample-videos.com/video/flv/720/big_buck_bunny_720p_1mb.flv'/>
			</div>*/}
			{/*canvas编辑*/}
			<div>
				{/*渲染组件*/}
				<CanvasView url={require('./canvas/img/homework.png')}/>
				{/*控制组件*/}
				
			</div>
		</div>)
	}
}

export default Section