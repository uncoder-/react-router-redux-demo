import React from 'react';
import ReactDom from 'react-dom';

import { Provider } from 'react-redux';
import { createStore ,applyMiddleware} from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers';

// 路由
import router from './router';
// 新建全局唯一store
let store = createStore(reducers,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDom.render(
	<Provider store={store}>{router}</Provider>,
	document.querySelector('#app')
)

