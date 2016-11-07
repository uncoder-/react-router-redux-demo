import { combineReducers } from 'redux'
import { CHANGE_NAME,CHANGE_AGE,SHOW_PAGE } from '../actions'

const initIndexData = {
	name:'react',
	age:2
}
function indexReducer(state = initIndexData, action) {
	switch (action.type) {
		case CHANGE_NAME:
			return action.text
		case CHANGE_AGE:
			return action.age
		default:
			return state
	}
}

const initSectionData = 0;
function sectionReducer(state = initSectionData,action){
	if(action.type == SHOW_PAGE){
		return action.page
	}
	return state
}
// 合并所有reduser
export default combineReducers({
	indexReducer:indexReducer,
	sectionReducer:sectionReducer
})