/**
 * Created by xiaobxia on 2018/1/26.
 */
import React, {PureComponent} from 'react'
import {Breadcrumb, Icon} from 'antd';
import {Link} from 'react-router-dom';
import {consoleRender} from 'localUtil/consoleLog'

class PageHeader extends PureComponent {
  render() {
    consoleRender('PageHeader render');
    return (
      <div className="page-header">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">
              <Icon type="home"/>
              主页
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span>{this.props.routeTitle}</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        {this.props.children}
      </div>
    );
  }
}
export default PageHeader;
