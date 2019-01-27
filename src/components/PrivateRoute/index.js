/**
 * Created by xiaobxia on 2017/10/19.
 */
import React, {PureComponent} from 'react';
import {Route, Redirect} from 'react-router-dom';
import {Spin} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'
import {consoleRender} from 'localUtil/consoleLog'
import {appActions} from 'localStore/actions'
//需要鉴权
class PrivateRoute extends PureComponent {
  componentWillMount() {
    //只有在刷新时才check
    if (!this.props.app.loginUser.isLogin) {
      this.props.appActions.appCheckLogin();
    }
  }

  render() {
    let store = this.props.app;
    //loading状态
    if (store.isGlobLoading) {
      return (
        <div className="glob-loading-wrap">
          <Spin size="large"/>
        </div>
      );
    }
    console.log(this.props.app.loginUser.login);
    if (this.props.app.loginUser.isLogin === undefined) {
      return null;
    }
    const {component: RouteComponent, ...rest} = this.props;
    consoleRender('PrivateRoute render');
    const app = rest.app;
    return (
      <Route {...rest} render={props => {
        if (app.loginUser.isLogin) {
          return (<RouteComponent {...props}/>);
        } else {
          return (<Redirect to={{
            pathname: '/user/login'
          }}/>);
        }
      }}/>
    );
  }
}

const mapStateToProps = state => {
  return {
    app: state.app
  }
};

const mapDispatchToProps = dispatch => ({
  //action在此为引入
  appActions: bindActionCreators(appActions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
