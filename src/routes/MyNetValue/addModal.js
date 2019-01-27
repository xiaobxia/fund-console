/**
 * Created by xiaobxia on 2018/1/31.
 */
import React, {PureComponent} from 'react'
import {Modal, Form, Input, Select, DatePicker} from 'antd';
import moment from 'moment'
import numberUtil from 'localUtil/numberUtil';

const FormItem = Form.Item;
const Option = Select.Option;

class AddModal extends PureComponent {
  handleOk = (e) => {
    const {
      onClose,
      onAdd,
      onUpdate,
      type,
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
      data.net_value_date = data.net_value_date.format('YYYY-MM-DD');
      if (type === 'add') {
        onAdd(data).then((res) => {
          if (res.success) {
            onClose();
          }
        });
      } else {
        onUpdate(data).then((res) => {
          if (res.success) {
            onClose();
          }
        });
      }
    });
  };
  handleCancel = (e) => {
    this.props.onClose();
  };

  render() {
    const {
      type,
      record,
      form: {
        getFieldDecorator
      }
    } = this.props;
    return (
      <div>
        <Modal
          title={type === 'add' ? '添加我的记录' : '更新我的记录'}
          visible={true}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem label="资产">
              {getFieldDecorator('asset', {
                initialValue: record.asset,
                rules: [
                  {required: true, message: '请输入资产'},
                  {pattern: /^\d+(\.\d+)?$/, message: '请输入资产'}
                ]
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem label="份额">
              {getFieldDecorator('shares', {
                initialValue: record.shares,
                rules: [
                  {required: true, message: '请输入份额'},
                  {pattern: /^\d+(\.\d+)?$/, message: '请输入份额'}
                ]
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem label="净值日期">
              {getFieldDecorator('net_value_date', {
                initialValue: record.net_value_date ? moment(record.net_value_date) : null,
                rules: [
                  {required: true, message: '请选择净值日期'}
                ]
              })(
                <DatePicker style={{width: '100%'}}/>
              )}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Form.create()(AddModal);
