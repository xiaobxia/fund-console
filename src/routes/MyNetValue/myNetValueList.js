/**
 * Created by xiaobxia on 2018/1/26.
 */
import React, {PureComponent} from 'react'
import {Table, Button, Divider, Popconfirm} from 'antd';
import {Link} from 'react-router-dom'

class MyNetValueList extends PureComponent {
  deleteHandler = (code) => {
    this.props.onDelete(code);
  };

  editHandler = (data) => {
    this.props.onEditHandler(data);
  };

  render() {
    const {pagination, dataSource, onChange, tableLoading} = this.props;
    const columns = [
      {
        title: '资产',
        dataIndex: 'asset'
      },
      {
        title: '份额',
        dataIndex: 'shares'
      },
      {
        title: '净值',
        dataIndex: 'net_value'
      },
      {
        title: '日期',
        dataIndex: 'net_value_date'
      },
      {
        title: '操作',
        width: 180,
        fixed: 'right',
        render: (record) => {
          return (
            <div>
              <a onClick={() => {
                this.editHandler(record)
              }}>编辑</a>
              <Divider type="vertical"/>
              <Popconfirm
                title="确认删除此记录?"
                onConfirm={() => {
                  this.deleteHandler(record.net_value_date)
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

export default MyNetValueList;
