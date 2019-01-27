import React, {PureComponent} from 'react';
import {HashRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import 'antd/dist/antd.css';
import './scss/index.scss';
import AuthLayout from './layouts/AuthLayout'
import BaseLayout from './layouts/BaseLayout'
import PrivateRoute from 'localComponent/PrivateRoute'

//无状态组件
class App extends PureComponent {
  render() {
    console.log('App render');
    return (
      <Router>
        <Switch>
          <Route path="/user" component={AuthLayout}/>
          <PrivateRoute path="/" component={BaseLayout}/>
        </Switch>
      </Router>
    );
  }
}

export default App;

