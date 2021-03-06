import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router';
import { changeName, changeAge } from '../actions';

class Index extends React.Component {
	static propTypes = {
		name: PropTypes.string,
		age: PropTypes.number
	}
	constructor(props) {
		super(...props);
		// 注册
		this.handleClick = this.alertName.bind(this);
	}
	componentWillMount() {
		//console.log('1');
	}
	componentDidMount() {
		//console.log('3');
	}
	componentWillReceiveProps() {
		//console.log('4')
	}
	shouldComponentUpdate() {
		//console.log('5')
		return true;
	}
	componentWillUpdate() {
		//console.log('6');
	}
	componentDidUpdate() {
		//console.log('7');
	}
	componentWillUnmount() {
		//console.log('8');
	}
	// 自定义方法
	setNewData = (e) => {
		const { dispatch, changeName } = this.props;
		dispatch(changeName('小强'));
		dispatch(changeAge(25));
	}
	alertName(){
		alert('name');
	}
	alertName2(){
		console.log(this);
		alert('name2');
	}
	render() {
		//console.log('2');
		let name = this.props.name;
		let age = this.props.age;
		let {children} = this.props;
		//console.log(this.props)
		return (<div>
			hello {name}! 我{age}岁了！
			<div onClick={this.setNewData}>设置新值</div>
			<br/>
			<div onClick={this.alertName}>点击我</div>
			<br/>
			<div onClick={this.alertName2}>click me!(在constructor里注册绑定)</div>
			<br/>	
			<div onClick = {(e) => this.alertName(e)}>点击我2（使用匿名函数）</div>
			<br/>		
			<Link to='/section' >go section page</Link>
			{children}
		</div>)
	}
}

export default connect(state => {
	//console.log(state)
	return ({
		name: state.indexReducer.name,
		age: state.indexReducer.age
	})
}, dispatch => {
	return ({ dispatch, changeName, changeAge })
})(Index);