/**
 * Created by xiaobxia on 2017/10/20.
 */
import React, {PureComponent} from 'react'
import {Menu, Icon, Dropdown, Avatar} from 'antd';
import {consoleRender} from 'localUtil/consoleLog'
//PureComponent浅比较
class AppHeader extends PureComponent {
  state = {
    loginUserMenuOpen: false,
    languageMenuOpen: false
  };

  visibleChangeHandler = (visible, key) => {
    this.setState({
      [key]: visible
    });
  };

  render() {
    consoleRender('Header render');
    const loginUserMenu = (
      <Menu style={{textAlign: 'center'}}>
        <Menu.Item>
          <div onClick={this.props.onLogout}>退出</div>
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <Dropdown overlay={loginUserMenu} trigger={['click']} onVisibleChange={(visible) => {
          this.visibleChangeHandler(visible, 'loginUserMenuOpen');
        }}>
          <span className="login-user-menu">
            <Avatar className="user-avatar" icon="user"/>
            {this.props.userName}
            <Icon style={{marginLeft: '.5em'}} type={this.state.loginUserMenuOpen ? 'up' : 'down'}/>
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default AppHeader;
