/**
 * Created by xiaobxia on 2018/1/31.
 */
import React, {PureComponent} from 'react'
import {Modal, Form, Input, Select} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class AddModal extends PureComponent {
  handleOk = (e) => {
    const {
      onClose,
      onAdd,
      form: {
        validateFields,
        getFieldsValue
      }
    } = this.props;
    validateFields((errors) => {
      if (errors) {
        return;
      }
      let data = {
        ...getFieldsValue()
      };
      onAdd(data).then((res) => {
        if (res.success) {
          onClose();
        }
      });
    });
  };
  handleCancel = (e) => {
    this.props.onClose();
  };

  render() {
    const {
      form: {
        getFieldDecorator
      }
    } = this.props;
    return (
      <div>
        <Modal
          title="添加任务"
          visible={true}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem label="名称">
              {getFieldDecorator('name', {
                rules: [
                  {required: true, message: '请输入名称'}
                ]
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem label="描述">
              {getFieldDecorator('describe', {
                rules: [
                  {required: true, message: '请输入描述'}
                ]
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem label="值">
              {getFieldDecorator('open', {
                rules: [
                  {required: true, message: '请输入值'}
                ]
              })(
                <Select style={{ width: '100%' }}>
                  <Option value="open">开启</Option>
                  <Option value="close">关闭</Option>
                </Select>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(AddModal);
