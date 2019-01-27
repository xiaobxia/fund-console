/**
 * Created by xiaobxia on 2018/1/26.
 */
import React, {PureComponent} from 'react'
import {Table, Button, Divider, Popconfirm} from 'antd';
import {Link} from 'react-router-dom'

class FundList extends PureComponent {
  deleteHandler = (code) => {
    this.props.onDelete(code);
  };

  render() {
    const {pagination, dataSource, onChange, tableLoading} = this.props;
    const columns = [
      {
        title: '代码',
        dataIndex: 'code'
      },
      {
        title: '名称',
        dataIndex: 'name'
      },
      {
        title: '净值',
        dataIndex: 'net_value'
      },
      {
        title: '购买费率',
        dataIndex: 'buy_rate_one'
      },
      {
        title: '卖出费率',
        dataIndex: 'sell_rate_two'
      },
      {
        title: '交易成本',
        render: (record) => {
          return record.buy_rate_one + record.sell_rate_two
        }
      },
      {
        title: '低费率',
        render: (record) => {
          return record.low_sell ? '是' : '否';
        }
      },
      {
        title: '可购',
        render: (record) => {
          return record.sell ? '可购' : '不可购';
        }
      },
      {
        title: '操作',
        width: 180,
        fixed: 'right',
        render: (record) => {
          return (
            <div>
              <Popconfirm
                title="确认删除此记录?"
                onConfirm={() => {
                  this.deleteHandler(record.code)
                }}
                okText="确定"
                cancelText="取消"
              >
                <a href="#">删除</a>
              </Popconfirm>
            </div>
          );
        }
      }
    ];
    return (
      <Table
        pagination={pagination}
        dataSource={dataSource}
        onChange={onChange}
        size="small"
        columns={columns}
        simple
        loading={tableLoading}
        rowKey={record => record._id}
      />
    );
  }
}

export default FundList;
