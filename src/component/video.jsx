import React from 'react';
import ReactDOM from 'react-dom';
import videojs from 'video.js';
import style from 'video.js/dist/video-js.css';
class VideoView extends React.Component{
	constructor(props){
		super(props);
	}
	componentDidMount(){
		const myVideo = this.refs.myVideo;
		const id = '#'+myVideo.getAttribute('id');
		//console.log(id)
		let player = videojs(id, {
			"controls" : true,
			"autoplay" : true,
			"preload" : "auto"
		}, function(){
			this.on('loadeddata',function(){
				console.log(this);
			})
			this.on('ended',function(){
				this.pause();
				this.hide();
			})
		});
	}
	render(){
		const url = this.props.src;
		return (<video
			id="myVideo"
			className="video-js vjs-default-skin vjs-big-play-centered"
			width="640" 
			height="264"
			ref="myVideo"
			>
			<source src={url} type='video/x-flv' />
		</video>)
	}
}
export default VideoView;