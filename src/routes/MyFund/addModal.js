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
      data.target_net_value = Math.round(10000 * ((data.target_rate / 100) + 1) * data.cost) / 10000;
      data.buy_date = data.buy_date.format('YYYY-MM-DD');
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
          title={type === 'add' ? '添加我的基金' : '更新我的基金'}
          visible={true}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Form>
            <FormItem label="代码">
              {getFieldDecorator('code', {
                initialValue: record.code,
                rules: [
                  {required: true, message: '请输入代码'},
                  {pattern: /^\d{6}$/, message: '请输入合法代码'}
                ]
              })(
                <Input/>
              )}
            </FormItem>
            <FormItem label="策略组">
              {getFieldDecorator('strategy', {
                initialValue: record.strategy,
                rules: [
                  {required: true, message: '请选择策略组'}
                ]
              })(
                <Select style={{width: '100%'}}>
                  <Option value="1">超跌搏反</Option>
                  <Option value="2">高风偏追涨</Option>
                  <Option value="3">顺应大势</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label="持仓成本">
              {getFieldDecorator('cost', {
                initialValue: record.cost,
                rules: [
                  {required: true, message: '请输入持仓成本'},
                  {pattern: /^\d+(\.\d+)?$/, message: '请输入合法持仓成本'}
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
            <FormItem label="购买日期">
              {getFieldDecorator('buy_date', {
                initialValue: record.buy_date ? moment(record.buy_date) : null,
                rules: [
                  {required: true, message: '请选择购买日期'}
                ]
              })(
                <DatePicker style={{width: '100%'}}/>
              )}
            </FormItem>
            <FormItem label="目标收益率">
              {getFieldDecorator('target_rate', {
                initialValue: record.target_net_value && record.cost ? numberUtil.countDifferenceRate(record.target_net_value, record.cost) : '',
                rules: [
                  {required: true, message: '请输入目标收益率'},
                  {pattern: /^\d+(\.\d+)?$/, message: '请输入合法目标收益率'}
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
