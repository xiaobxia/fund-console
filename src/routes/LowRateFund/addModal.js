/**
 * Created by xiaobxia on 2018/1/31.
 */
import React, {PureComponent} from 'react'
import {Modal, Form, Input} from 'antd';

const FormItem = Form.Item;

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
      onAdd(data.code).then((res) => {
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
          title="添加我的关注"
          visible={true}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem label="代码">
              {getFieldDecorator('code', {
                rules: [
                  {required: true, message: '请输入代码'},
                  {pattern: /^\d{6}$/, message: '请输入合法代码'}
                ]
              })(
                <Input/>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(AddModal);
