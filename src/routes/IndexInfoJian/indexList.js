/**
 * Created by xiaobxia on 2018/1/26.
 */
import React, {PureComponent} from 'react'
import {Table, Button, Divider, Popconfirm} from 'antd';
import {Link} from 'react-router-dom'
import numberUtil from 'localUtil/numberUtil';
import indexInfoUtil from 'localUtil/indexInfoUtilJian';
import ReactEcharts from 'echarts-for-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const fnMap = indexInfoUtil.fnMap;
const InfoUtil = indexInfoUtil.Util;

const functionName = 'ifSellYiqian'
let hide = 'buy'

const isDev = process.env.NODE_ENV !== 'production'
if (!isDev) {
  hide = false
}

class IndexList extends PureComponent {

  getChartOption = () => {
    const threshold = this.props.threshold;
    const rate = this.props.rate;
    const wave = this.props.wave;
    const infoConfig = {threshold, rate, wave};
    const recentNetValue = this.props.dataSource;
    const infoUtil = new InfoUtil(infoConfig)
    let xData = [];
    let yData = [];
    let points = [];
    recentNetValue.forEach((item, index) => {
      xData.unshift(item['date']);
      yData.unshift(item['close']);
      const oneDayRecord = recentNetValue[index < recentNetValue.length - 1 ? index + 1 : index];
      const twoDayRecord = recentNetValue[index < recentNetValue.length - 2 ? index + 2 : index + 1];
      let bugFlag = infoUtil[fnMap[this.props.nowType + 'Buy']](item, oneDayRecord, twoDayRecord);
      let sellFlag = infoUtil[fnMap[this.props.nowType + 'Sell']](item, oneDayRecord, twoDayRecord);
      if (hide !== 'buy' && ((bugFlag === true) || (bugFlag !== false && bugFlag.flag === true))) {
        points.push({
          coord: [item['date'], item['close']],
          itemStyle: {
            normal: {
              color: (bugFlag !== false && bugFlag.new === true) ? 'black' : 'red'
            }
          },
          label: {
            show: false
          }
        })
      } else if (hide !== 'sell' && ((sellFlag === true) || (sellFlag !== false && sellFlag.flag === true))) {
        points.push({
          coord: [item['date'], item['close']],
          itemStyle: {
            normal: {
              color: (sellFlag !== false && sellFlag.new === true) ? 'black' : 'green'
            }
          },
          label: {
            show: false
          }
        })
      }
    });
    return {
      title: {
        text: '净值变化',
        left: 'center',
        textStyle: {
          color: 'rgba(0, 0, 0, 0.85)',
          fontWeight: '500'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      xAxis: {
        type: 'category',
        data: xData
      },
      yAxis: {
        type: 'value',
        scale: true
      },
      series: [
        {
          name: '净值',
          data: yData,
          type: 'line',
          lineStyle: {
            color: '#1890ff'
          },
          smooth: false,
          symbol: 'none',
          markPoint: {
            data: points,
            symbol: 'circle',
            symbolSize: 6
          }
        }
      ]
    };
  };

  render() {
    const columns = [
      {
        title: '日期',
        width: 80,
        dataIndex: 'date'
      },
      {
        title: '幅度',
        width: 50,
        render: (record) => {
          const rate = numberUtil.keepTwoDecimals(record.netChangeRatio);
          return <span className={rate > 0 ? 'red-text' : 'green-text'}>{rate}</span>
        }
      },
      {
        title: '高开',
        width: 80,
        render: (record) => {
          const threshold = this.props.threshold;
          const rate = this.props.rate;
          const wave = this.props.wave;
          const infoConfig = {threshold, rate, wave};
          const infoUtil = new InfoUtil(infoConfig)
          const up = infoUtil.ifUpOpen(record);
          return <span className={up > 0 ? 'red-text' : 'green-text'}>{up ? '高开' : '低开'}</span>
        }
      },
      {
        title: '开盘大幅',
        width: 80,
        render: (record) => {
          const threshold = this.props.threshold;
          const rate = this.props.rate;
          const wave = this.props.wave;
          const infoConfig = {threshold, rate, wave};
          const infoUtil = new InfoUtil(infoConfig)
          const up = infoUtil.ifOpenHigh(record);
          return <span className={up > 0 ? 'red-text' : 'green-text'}>{up ? '大幅' : '低幅'}</span>
        }
      },
      {
        title: '收涨',
        width: 80,
        render: (record) => {
          const threshold = this.props.threshold;
          const rate = this.props.rate;
          const wave = this.props.wave;
          const infoConfig = {threshold, rate, wave};
          const infoUtil = new InfoUtil(infoConfig)
          const up = infoUtil.ifUpClose(record);
          return <span className={up ? 'red-text' : 'green-text'}>{up ? '收高' : '收跌'}</span>
        }
      },
      {
        title: '收盘大幅',
        width: 80,
        render: (record) => {
          const threshold = this.props.threshold;
          const rate = this.props.rate;
          const wave = this.props.wave;
          const infoConfig = {threshold, rate, wave};
          const infoUtil = new InfoUtil(infoConfig)
          const up = infoUtil.ifCloseHigh(record);
          return <span className={up ? 'red-text' : 'green-text'}>{up ? '大幅' : '低幅'}</span>
        }
      },
      {
        title: '盘中下跌',
        width: 50,
        render: (record) => {
          const threshold = this.props.threshold;
          const rate = this.props.rate;
          const wave = this.props.wave;
          const infoConfig = {threshold, rate, wave};
          const infoUtil = new InfoUtil(infoConfig)
          const flag = infoUtil.ifSessionDown(record);
          return <span className={!flag ? 'red-text' : 'green-text'}>{flag ? '是' : '否'}</span>
        }
      },
      {
        title: '收盘拉起',
        width: 50,
        render: (record) => {
          const threshold = this.props.threshold;
          const rate = this.props.rate;
          const wave = this.props.wave;
          const infoConfig = {threshold, rate, wave};
          const infoUtil = new InfoUtil(infoConfig)
          const flag = infoUtil.ifSessionUpClose(record);
          return <span className={flag ? 'red-text' : 'green-text'}>{flag ? '是' : '否'}</span>
        }
      },
      {
        title: '盘中上升',
        width: 50,
        render: (record) => {
          const threshold = this.props.threshold;
          const rate = this.props.rate;
          const wave = this.props.wave;
          const infoConfig = {threshold, rate, wave};
          const infoUtil = new InfoUtil(infoConfig)
          const flag = infoUtil.ifSessionUp(record);
          return <span className={flag ? 'red-text' : 'green-text'}>{flag ? '是' : '否'}</span>
        }
      },
      {
        title: '收盘回落',
        width: 50,
        render: (record) => {
          const threshold = this.props.threshold;
          const rate = this.props.rate;
          const wave = this.props.wave;
          const infoConfig = {threshold, rate, wave};
          const infoUtil = new InfoUtil(infoConfig)
          const flag = infoUtil.ifSessionDownClose(record);
          return <span className={!flag ? 'red-text' : 'green-text'}>{flag ? '是' : '否'}</span>
        }
      },
      {
        title: '无抵抗',
        width: 50,
        render: (record) => {
          const threshold = this.props.threshold;
          const rate = this.props.rate;
          const wave = this.props.wave;
          const infoConfig = {threshold, rate, wave};
          const infoUtil = new InfoUtil(infoConfig)
          const flag = infoUtil.ifHighPreCloseDown(record);
          return <span className={flag ? 'red-text' : 'green-text'}>{flag ? '是' : '否'}</span>
        }
      },
      {
        title: '复制',
        width: 50,
        render: (record) => {
          const threshold = this.props.threshold;
          const rate = this.props.rate;
          const wave = this.props.wave;
          const infoConfig = {threshold, rate, wave};
          const infoUtil = new InfoUtil(infoConfig)
          let flag = {}
          flag.ifUpOpen = infoUtil.ifUpOpen(record)
          flag.ifOpenHigh = infoUtil.ifOpenHigh(record)
          flag.ifUpClose = infoUtil.ifUpClose(record)
          flag.ifCloseHigh = infoUtil.ifCloseHigh(record)
          flag.ifSessionDown = infoUtil.ifSessionDown(record)
          flag.ifSessionUpClose = infoUtil.ifSessionUpClose(record)
          flag.ifSessionUp = infoUtil.ifSessionUp(record)
          flag.ifSessionDownClose = infoUtil.ifSessionDownClose(record)
          let str = JSON.stringify(flag)
          str = str.split(':').join(': ')
          str = str.split(',').join(', ')
          str = str.replace(/"/g, '\'')
          return <CopyToClipboard
            text={str}
            onCopy={() => {
            }}>
            <span>复制</span>
          </CopyToClipboard>
        }
      }
    ];
    const {dataSource} = this.props;
    return (
      <div>
        <ReactEcharts
          option={this.getChartOption(dataSource)}
          notMerge={true}
          style={{height: '300px'}}
          lazyUpdate={true}
          theme={'theme_name'}
        />
        <Table
          dataSource={dataSource}
          columns={columns}
          simple
          pagination={false}
          size="small"
          rowKey={record => record.date}
          onSelect={this.onSelectRow}
          rowClassName={(record, index) => {
            const threshold = this.props.threshold;
            const rate = this.props.rate;
            const wave = this.props.wave;
            const infoConfig = {threshold, rate, wave};
            const infoUtil = new InfoUtil(infoConfig)
            const recentNetValue = dataSource;
            const oneDayRecord = recentNetValue[index < recentNetValue.length - 1 ? index + 1 : index];
            const twoDayRecord = recentNetValue[index < recentNetValue.length - 2 ? index + 2 : index + 1];
            let active = false;
            let flag = infoUtil[functionName](record, oneDayRecord, twoDayRecord);
            if (((flag !== false && flag !== true && flag.new === true)) && isDev) {
              active = true;
            }
            return active ? 'active' : 'false'
          }}
        />
      </div>
    );
  }
}

export default IndexList;
