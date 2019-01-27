/**
 * Created by xiaobxia on 2017/11/16.
 */
import React, {PureComponent} from 'react'
import {Icon, Button} from 'antd';
import {withRouter} from 'react-router-dom'
import {consoleRender} from 'localUtil/consoleLog'
import http from 'localUtil/httpUtil';
import qs from 'qs'
import Exception404 from 'localComponent/404'

class UserActive extends PureComponent {
  state = {
    legal: '',
    verifyEnd: false
  };

  componentWillMount() {
    let query = qs.parse(this.props.location.search.slice(1));
    if (!query.code) {
      this.setState({
        legal: '404',
        verifyEnd: true
      });
      return false;
    }
    http.get('sys/user/register/active' + this.props.location.search).then((data) => {
      if (data.success) {
        this.setState({
          verifyEnd: true,
          legal: 'success'
        });
      } else {
        this.setState({
          verifyEnd: true,
          legal: 'overdue'
        });
      }
    });
  }

  renderResult() {
    switch (this.state.legal) {
      case 'success': {
        return (<div>
          <Icon type="check-circle"/>
          <h2>验证成功</h2>
          <p>正在跳转到首页</p>
        </div>);
      }
      case 'overdue': {
        return (<div>
          <h3>链接已过期</h3>
        </div>);
      }
      case '404': {
        return (<Exception404/>);
      }
      default : {
        return (<Exception404/>);
      }
    }
  }

  render() {
    consoleRender('UserActive render');
    if (!this.state.verifyEnd) {
      return null;
    }
    return (
      <div className="register-active">
        {this.renderResult()}
      </div>
    );
  }
}

export default withRouter(UserActive);
