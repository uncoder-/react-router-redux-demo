import React from 'react';
import { connect } from 'react-redux';
import { showPage } from '../actions'
class Section extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		let page = this.props.page;
		return (<div>section page!</div>)
	}
}

export default connect(state =>{
	return state.sectionReducer
},dispatch =>{
	return {dispatch}
})(Section)