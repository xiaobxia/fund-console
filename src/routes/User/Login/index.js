/**
 * Created by xiaobxia on 2017/10/18.
 */
import React, {PureComponent} from 'react'
import {Card, Alert} from 'antd';
import {connect} from 'react-redux'
import {withRouter, Link} from 'react-router-dom'
import {bindActionCreators} from 'redux';
import {consoleRender} from 'localUtil/consoleLog'
import LoginForm from './form'
import {appActions} from 'localStore/actions'

class Login extends PureComponent {
  state = {
    showError: false,
    errorMsg: ''
  };

  onClose = () => {
    this.setState({
      showError: false,
      errorMsg: ''
    });
  };

  loginHandler = (formData) => {
    const {appActions} = this.props;
    appActions.appLogin(formData).then((data) => {
      if (data.success === false) {
        if (data.message) {
          this.setState({
            showError: true,
            errorMsg: data.message
          });
        }
      } else {
        this.props.history.push('/');
      }
    });
  };

  render() {
    console.log(this.props)
    consoleRender('Login render');
    // 渲染多次的原因是，自动填充了两次
    return (
      <div className="login-wrap">
        <h2 className="logo">我的控制台</h2>
        <Card hoverable={false} bordered={false}>
          {this.state.showError && (
            <Alert message={this.state.errorMsg} type="error" closable onClose={this.onClose}/>)}
          <LoginForm onLoginHandler={this.loginHandler}>
            {/*<Link to="/user/forgot">忘记密码</Link>*/}
          </LoginForm>
          {/*<Link to="/user/register">去注册</Link>*/}
        </Card>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));
