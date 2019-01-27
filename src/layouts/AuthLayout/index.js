/**
 * Created by xiaobxia on 2017/11/13.
 */
import React, {PureComponent} from 'react'
import {withRouter, Route, Switch} from 'react-router-dom'
import DocumentTitle from 'react-document-title';
import {consoleRender} from 'localUtil/consoleLog'
import {authRoutes} from '../../router'
import GlobalFooter from 'localComponent/GlobalFooter'

class AuthLayout extends PureComponent {
  componentDidMount() {
    console.log('AuthLayout mount');
  }

  getTitle() {
    const pathMap = {
      '/user/login': '登录'
    };
    return pathMap[this.props.location.pathname];
  }

  render() {
    consoleRender('AuthLayout render');
    return (
      <DocumentTitle title={this.getTitle()}>
        <div className="auth-wrap">
          <Switch>
            {authRoutes.map((item) => {
              return (<Route exact key={item.path} path={item.path} component={item.component}/>);
            })}
          </Switch>
          <div className="footer-wrap">
            <GlobalFooter/>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default withRouter(AuthLayout);
