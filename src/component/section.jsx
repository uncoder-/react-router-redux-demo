import React from 'react';
import ReactDOM from 'react-dom';
import PDF from './PDF.jsx'
class Section extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		return (<div>
		section page!
		<PDF src='http://localhost:8080/test09.pdf' />
		</div>)
	}
}

export default Section