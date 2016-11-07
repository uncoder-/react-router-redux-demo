import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import { changeName, changeAge } from '../actions';

class Index extends React.Component {
	static propTypes = {
		name: PropTypes.string,
		age: PropTypes.number
	}
	constructor(props) {
		super(...props);
	}
	componentWillMount() {
		console.log('1');
	}
	componentDidMount() {
		console.log('3');
	}
	componentWillReceiveProps() {
		console.log('4')
	}
	shouldComponentUpdate() {
		console.log('5')
		return true;
	}
	componentWillUpdate() {
		console.log('6');
	}
	componentDidUpdate() {
		console.log('7');
	}
	componentWillUnmount() {
		console.log('8');
	}
	// 自定义方法
	setNewData = e => {
		const { dispatch, changeName } = this.props;
		dispatch(changeName('小强'));
		dispatch(changeAge(25));
	}
	render() {
		console.log('2');
		let name = this.props.name;
		let age = this.props.age;
		return <div onClick={this.setNewData}>
			hello {name}! 我{age}岁了！
		</div>
	}
}

export default connect(state => {
	console.log(state);
	return ({
		name: state.indexReducer.name,
		age: state.indexReducer.age
	})
}, dispatch => {
	return ({ dispatch, changeName, changeAge })
})(Index);