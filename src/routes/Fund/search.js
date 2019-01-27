/**
 * Created by xiaobxia on 2018/2/12.
 */
import React, {PureComponent} from 'react'
import {Modal, Form, Input, Button, Spin, Select} from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;

class Search extends PureComponent {
  handleOk = (e) => {
    const {
      onSearch,
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
      if (data.sell === 'all') {
        delete data.sell
      } else if (data.sell === 'sell') {
        data.sell = true
      } else if (data.sell === 'noSell') {
        data.sell = false
      }
      onSearch(data)
    });
  };

  render() {
    const {
      form: {
        getFieldDecorator
      }
    } = this.props;
    return (
      <div>
        <Form layout="inline" style={{textAlign: 'center'}}>
          <FormItem label="销售状态">
            {getFieldDecorator('sell')(
              <Select defaultValue="all" style={{ width: 120 }}>
                <Option value="all">全部</Option>
                <Option value="sell">可售</Option>
                <Option value="noSell">不可售</Option>
              </Select>
            )}
          </FormItem>
          <FormItem label="关键词">
            {getFieldDecorator('keyword')(
              <Input.Search
                placeholder="代码/名称"
                onSearch={this.handleOk}
                enterButton
              />
            )}
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Search);
