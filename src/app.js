import React from 'react';
import ReactDom from 'react-dom';

import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducers from './reducers';

// 路由
import router from './router';
// 新建全局唯一store
let store = createStore(reducers);

ReactDom.render(
	<Provider store={store}>{router}</Provider>,
	document.querySelector('#app')
)

