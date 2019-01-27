/**
 * Created by xiaobxia on 2017/11/14.
 */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Form, Input, Button, Select, Row, Col, Popover, Progress} from 'antd';
import md5 from 'md5';
import http from 'localUtil/httpUtil';

const FormItem = Form.Item;

const passwordStatusMap = {
  ok: <p>强度：强</p>,
  pass: <p>强度：中</p>,
  pool: <p>强度：太短</p>
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  pool: 'exception'
};

// 不在全局注册东西
class Register extends Component {
  state = {
    confirmDirty: false,
    visible: false,
    help: ''
  };

  getPasswordStatus = (value) => {
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'pool';
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({force: true},
      (err, values) => {
        if (!err) {
          delete values.confirm;
          values.password = md5(values.password);
          http.post('sys/user/register', values).then((data) => {
            if (data.success) {
              this.props.history.push('/user/registerResult?code=' + data.code);
            }
          });
        }
      }
    );
  };

  checkConfirm = (rule, value, callback) => {
    const {form} = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value
      });
      callback('error');
    } else {
      this.setState({
        help: ''
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const {form} = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], {force: true});
        }
        callback();
      }
    }
  };

  renderPasswordProgress = () => {
    const {form} = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus(value);
    return value && value.length
      ? <div>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div> : null;
  };

  render() {
    const {form} = this.props;
    const {getFieldDecorator} = form;
    return (
      <div className="register-wrap">
        <h3>注册</h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('userName', {
              rules: [{
                required: true, message: '请输入用户名！'
              }]
            })(
              <Input size="large" placeholder="用户名"/>
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('email', {
              rules: [{
                required: true, message: '请输入邮箱地址！'
              }, {
                type: 'email', message: '邮箱地址格式错误！'
              }]
            })(
              <Input size="large" placeholder="邮箱"/>
            )}
          </FormItem>
          <FormItem help={this.state.help}>
            <Popover
              content={
                <div style={{padding: '4px 0'}}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <p style={{marginTop: 10}}>请至少输入 6 个字符。请不要使用容易被猜到的密码。</p>
                </div>
              }
              overlayStyle={{width: 240}}
              placement="right"
              visible={this.state.visible}
            >
              {getFieldDecorator('password', {
                rules: [{
                  validator: this.checkPassword
                }]
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder="至少6位密码，区分大小写"
                />
              )}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [{
                required: true, message: '请确认密码！'
              }, {
                validator: this.checkConfirm
              }]
            })(
              <Input
                size="large"
                type="password"
                placeholder="确认密码"
              />
            )}
          </FormItem>
          <FormItem>
            <Button size="large" type="primary" htmlType="submit">注册</Button>
          </FormItem>
          <Link to="/user/login">使用已有账户登录</Link>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Register);
