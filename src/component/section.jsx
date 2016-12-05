import React from 'react';
import ReactDOM from 'react-dom';
import PDF from './PDF.jsx'
class Section extends React.Component{
	constructor(props){
		super(props);
		this.state = {visibility:true}
	}
	render(){
		const visibility = {display:this.state['visibility']?'none':'block'}
		return (<div>
			section page!
			{/**pdf预览 */}
			<div style={visibility}>
				<PDF src='http://localhost:8080/test09.pdf'/>
			</div>
		</div>)
	}
}

export default Section