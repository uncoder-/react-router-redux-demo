import React from 'react';
import {Router, Route, Link,hashHistory,browserHistory} from 'react-router';

import Index from '../component/index.jsx';
import Section from '../component/section.jsx';

let router = (
		<Router history={hashHistory} >
			<Route path='/' component={Index} >
				<Route path='/section' component={Section} />
			</Route>
		</Router>
	)
export default router;