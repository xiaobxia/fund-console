/**
 * Created by xiaobxia on 2018/1/26.
 */
import React, {PureComponent} from 'react'
import {Table, Button, Divider, Popconfirm} from 'antd';
import {Link} from 'react-router-dom'
import numberUtil from 'localUtil/numberUtil';
import EditableCell from 'localComponent/EditableCell'

class FundList extends PureComponent {
  deleteHandler = (code) => {
    this.props.onDeleteHandler(code);
  };

  render() {
    const columns = [
      {
        title: '代码',
        width: 80,
        dataIndex: 'code'
      },
      {
        title: '名称',
        render: (record) => {
          if (record.name.length > 20) {
            return record.name.substr(0, 17) + '...';
          } else {
            return record.name;
          }
        }
      },
      {
        title: '持仓成本',
        width: 90,
        render: (record) => {
          return Math.round(record.costSum);
        }
      },
      {
        title: '持仓净值',
        width: 90,
        render: (record) => {
          return Math.round(record.sum);
        }
      },
      {
        title: '持仓估值',
        width: 90,
        render: (record) => {
          const isUp = record.valuationSum > record.sum;
          const isEqual = record.valuationSum === record.sum;
          return (
            <span className={isUp ? 'red-text' : isEqual ? '' : 'green-text'}>{Math.round(record.valuationSum)}</span>
          );
        }
      },
      {
        title: '当天收益',
        width: 90,
        render: (record) => {
          if (!record.valuationSum || !record.sum) {
            return '---'
          }
          const isUp = record.valuationSum > record.sum;
          const isEqual = record.valuationSum === record.sum;
          return (
            <span
              className={isUp ? 'red-text' : isEqual ? '' : 'green-text'}>{Math.round(record.valuationSum - record.sum)}</span>
          );
        }
      },
      {
        title: '当天涨幅',
        width: 90,
        render: (record) => {
          const isUp = record.change_ratio > 0
          const isEqual = record.change_ratio === 0
          return (
            <span
              className={isUp ? 'red-text' : isEqual ? '' : 'green-text'}>{`${record.change_ratio}%`}</span>
          );
        }
      },
      {
        title: '总收益',
        width: 90,
        render: (record) => {
          if (!record.valuationSum || !record.costSum) {
            return '---'
          }
          const isUp = record.valuationSum > record.costSum;
          const isEqual = record.valuationSum === record.costSum;
          return (
            <span
              className={isUp ? 'red-text' : isEqual ? '' : 'green-text'}>{Math.round(record.valuationSum - record.costSum)}</span>
          );
        }
      },
      {
        title: '收益率',
        width: 90,
        render: (record) => {
          if (!record.valuationSum || !record.costSum) {
            return '---'
          }
          const rate = numberUtil.countDifferenceRate(record.valuationSum, record.costSum);
          const isUp = rate > 0;
          const isEqual = rate === 0;
          return (
            <span
              className={isUp ? 'red-text' : isEqual ? '' : 'green-text'}>{`${rate}%`}</span>
          );
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
                title="确认删除此基金?"
                onConfirm={() => {
                  this.deleteHandler(record.code)
                }}
                okText="确定"
                cancelText="取消"
              >
                <a>删除</a>
              </Popconfirm>
            </div>
          );
        }
      }
    ];
    const {dataSource, tableLoading} = this.props;
    return (
      <Table
        dataSource={dataSource}
        columns={columns}
        simple
        pagination={false}
        size="small"
        loading={tableLoading}
        rowKey={record => record.code}
      />
    );
  }
}

export default FundList;
