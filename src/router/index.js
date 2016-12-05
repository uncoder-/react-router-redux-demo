import React from 'react';
import {Router, Route, Link,hashHistory,browserHistory,IndexRoute,IndexRedirect} from 'react-router';

import Index from '../component/index.jsx';
import Section from '../component/section.jsx';

let router = (
		<Router history={hashHistory} >
			<Route path='/' component={Index} 
				onEnter={
					(history, replace) => {
						if(true){
							// 不用登陆
						}else{
							replace('/login');
						}
					}
				}
			>
				<IndexRedirect to="section" />
				<Route path='section' component={Section} />
			</Route>
		</Router>
	)
export default router;