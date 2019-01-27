import React, {PureComponent} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import {bindActionCreators} from 'redux';
import {Icon, Layout, notification} from 'antd';
import AppMenu from './menu'
import AppHeader from './header'
import ModelLogin from './modelLogin'
const {Header, Content, Sider} = Layout;
import {appActions} from 'localStore/actions'
import {consoleRender} from 'localUtil/consoleLog'
import {baseRoutes} from '../../router'
import GlobalFooter from 'localComponent/GlobalFooter'


class BaseLayout extends PureComponent {
  constructor() {
    super();
  }

  toggleCollapsed = () => {
    this.props.appActions.appToggleCollapsed();
  };

  componentWillMount() {
  }

  //生命周期mount
  componentDidMount() {
    if (this.props.app.loginUser.active === 'N') {
      notification.open({
        message: 'Notification Title',
        description: '请尽快去验证邮箱',
        icon: <Icon type="smile-circle" style={{color: '#108ee9'}}/>
      });
    }
  }

  //生命周期销毁前
  componentWillUnmount() {
  }

  render() {
    consoleRender('BaseLayout render');
    let props = this.props;
    let store = this.props.app;
    console.log(store.loginUser);
    return (
        <div className="app-main">
          <Layout>
            <Sider
              trigger={null}
              collapsible
              className="app-sider"
              collapsed={store.collapsed}
            >
              <div className="logo">
                XBX
              </div>
              <AppMenu/>
            </Sider>
            {/*ant内部有classnames所以能直接用，原生的标签与要这个库*/}
            <Layout className={{'app-content': true, 'open': !store.collapsed}}>
              <Header className="app-header">
                <div className="trigger-wrap">
                  <Icon
                    className="trigger"
                    type={store.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggleCollapsed}
                  />
                </div>
                <AppHeader
                  userName={store.loginUser.name}
                  onLogout={props.appActions.appLogout}
                />
              </Header>
              <Content className="app-route-view">
                <Switch>
                  {baseRoutes.map((item) => {
                    return (<Route exact key={item.path} path={item.path} component={item.component}/>);
                  })}
                </Switch>
                <div className="footer-wrap">
                  <GlobalFooter/>
                </div>
              </Content>
              <ModelLogin
                onLogin={props.appActions.appInsetLogin}
                onHide={props.appActions.appHideGlobLogin}
                visible={store.showGlobLogin}
              />
            </Layout>
          </Layout>
        </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BaseLayout));
