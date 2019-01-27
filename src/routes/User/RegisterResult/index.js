/**
 * Created by xiaobxia on 2017/11/16.
 */
import React, {PureComponent} from 'react'
import {Icon, Button} from 'antd';
import {withRouter, Link} from 'react-router-dom'
import {consoleRender} from 'localUtil/consoleLog'
import http from 'localUtil/httpUtil';
import qs from 'qs'
import Exception404 from 'localComponent/404'

class RegisterResult extends PureComponent {
  state = {
    emailAccount: '',
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
    http.get('sys/user/register/result' + this.props.location.search).then((data) => {
      if (data.success) {
        this.setState({
          verifyEnd: true,
          legal: 'success',
          emailAccount: data.email
        });
      } else {
        this.setState({
          verifyEnd: true,
          legal: '404'
        });
      }
    });
  }

  renderResult() {
    switch (this.state.legal) {
      case 'success': {
        return (<div>
          <Icon type="check-circle"/>
          <h2>你的账户：{this.state.emailAccount} 注册成功</h2>
          <p>激活邮件已发送到你的邮箱中，邮件有效期为24小时。请及时登录邮箱，点击邮件中的链接激活帐户。</p>
          <Link to="/"><Button size="large">返回首页</Button></Link>
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
    consoleRender('RegisterResult render');
    if (!this.state.verifyEnd) {
      return null;
    }
    return (
      <div className="register-result">
        {this.renderResult()}
      </div>
    );
  }
}

export default withRouter(RegisterResult);
