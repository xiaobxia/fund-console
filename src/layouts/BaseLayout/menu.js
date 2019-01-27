/**
 * Created by xiaobxia on 2017/10/19.
 */
import React, {Component} from 'react'
import {Link, withRouter} from 'react-router-dom'
import {Menu, Icon} from 'antd';
import {consoleRender} from 'localUtil/consoleLog'
import {menusInfos, getOpenKeyAndMainPath} from '../../router'
const SubMenu = Menu.SubMenu;

// 不用纯的
class AppMenu extends Component {
  render() {
    const keyInfo = getOpenKeyAndMainPath(this.props.location.pathname);
    console.log(keyInfo)
    return (
      <Menu
        theme="dark"
        inlineCollapsed={this.props.collapsed}
        defaultOpenKeys={[keyInfo.openKey]}
        selectedKeys={[keyInfo.mainPath]}
        mode="inline"
      >
        {
          menusInfos.map((item) => {
            if (item.children) {
              return (
                <SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
                  {item.children.map((subItem) => {
                    return (
                      <Menu.Item key={subItem.pathname}><Link to={subItem.pathname}>{subItem.title}</Link></Menu.Item>);
                  })}
                </SubMenu>
              );
            } else {
              return (<Menu.Item key={item.pathname}><Link to={item.pathname}><Icon type={item.icon}/>{item.title}</Link></Menu.Item>);
            }
          })
        }
      </Menu>
    );
  }
}

export default withRouter(AppMenu);
