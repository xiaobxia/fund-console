/**
 * Created by xiaobxia on 2018/1/26.
 */
import React, {PureComponent} from 'react'
import {Table, Button, Divider, Popconfirm, Tag} from 'antd';
import {Link} from 'react-router-dom'

class FundList extends PureComponent {
  deleteHandler = (code) => {
    this.props.onDelete(code);
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
        dataIndex: 'name'
      },
      {
        title: '买入理由',
        render: (record) => {
          const result = record.result;
          return (
            <p>
              {result.isMonthSlump && <Tag color="#52c41a">一月暴跌</Tag>}
              {result.isHalfMonthSlump && <Tag color="#52c41a">半月暴跌</Tag>}
              {result.isLow && <Tag color="#108ee9">低位</Tag>}
              {result.isLowHalf && <Tag color="#108ee9">半年低位</Tag>}
              {result.isMin && <Tag color="#13c2c2">新低</Tag>}
            </p>
          );
        }
      },
      {
        title: '卖出理由',
        render: (record) => {
          const result = record.result;
          return (
            <p>
              {result.isMonthBoom && <Tag color="magenta">近期暴涨</Tag>}
              {result.isHalfMonthBoom && <Tag color="magenta">超短暴涨</Tag>}
              {result.isHigh && <Tag color="gold">高位</Tag>}
              {result.isHighHalf && <Tag color="gold">半年高位</Tag>}
            </p>
          );
        }
      },
      {
        title: '幅度',
        render: (record) => {
          if (!record) {
            return '---'
          }
          const isUp = record.valuationRate > 0;
          const isEqual = record.valuationRate === 0;
          return (
            <span
              className={isUp ? 'red-text' : isEqual ? '' : 'green-text'}>{`${record.valuationRate}%`}</span>
          );
        }
      },
      {
        title: '是否持有',
        dataIndex: 'has',
        filters: [{
          text: '是',
          value: true
        }, {
          text: '否',
          value: false
        }],
        filterMultiple: false,
        onFilter: (value, record) => {
          let valueTemp = value === 'true';
          return record.has === valueTemp;
        },
        render: (has) => {
          return has ? <span className="red-text">是</span> : '否';
        }
      },
      {
        title: '操作',
        width: 180,
        fixed: 'right',
        render: (record) => {
          return (
            <div>
              <Link to={'/fund/' + record.code}>查看</Link>
              <Divider type="vertical"/>
              <Popconfirm
                title="确认删除此记录?"
                onConfirm={() => {
                  this.deleteHandler(record.code)
                }}
                okText="确定"
                cancelText="取消"
              >
                <a href="#">删除基金</a>
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
