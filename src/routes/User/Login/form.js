/**
 * Created by xiaobxia on 2017/11/13.
 */
import React, {PureComponent} from 'react'
import {Icon, Button, Form, Input} from 'antd';
import {consoleRender} from 'localUtil/consoleLog'
const FormItem = Form.Item;
class LoginForm extends PureComponent {
  loginHandler = () => {
    const {
      form: {
        getFieldsValue
      },
      onLoginHandler
    } = this.props;
    onLoginHandler(getFieldsValue());
  };
  render() {
    consoleRender('LoginForm render');
    // 渲染多次的原因是，自动填充了两次
    const {
      form: {
        getFieldDecorator
      },
      children
    } = this.props;
    return (
        <Form className="login-form">
          <FormItem>
            {getFieldDecorator('user', {
              rules: [{required: true, message: '请输入账户'}]
            })(
              <Input prefix={<Icon type="user" style={{fontSize: 13}}/>} placeholder="用户名/邮箱/手机号"/>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('password', {
              rules: [{required: true, message: '请输入密码'}]
            })(
              <Input prefix={<Icon type="lock" style={{fontSize: 13}}/>} type="password" placeholder="密码"/>
            )}
          </FormItem>
          {children}
          <FormItem style={{marginTop: '20px'}}>
            <Button style={{width: '100%'}} type="primary" htmlType="submit" className="login-form-button"
                    onClick={this.loginHandler}>
              登录
            </Button>
          </FormItem>
        </Form>
    );
  }
}

export default Form.create()(LoginForm);
