/**
 * Created by xiaobxia on 2018/1/26.
 */
import React, {PureComponent} from 'react'
import {Table, Button, Divider, Popconfirm} from 'antd';
import {Link} from 'react-router-dom'
import numberUtil from 'localUtil/numberUtil';
import indexInfoUtil from 'localUtil/platformFixedInvestment';
import ReactEcharts from 'echarts-for-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const fnMap = indexInfoUtil.fnMap;
const InfoUtil = indexInfoUtil.Util;

const functionName = 'ifBuyYiqian'

const isDev = process.env.NODE_ENV !== 'production'

function getBuyRate(rate) {
  if (rate >= 4 && rate < 8) {
    return 0.9
  }
  if (rate >= 8 && rate < 12) {
    return 0.8
  }
  if (rate >= 12 && rate < 16) {
    return 0.7
  }
  if (rate >= 16 && rate < 20) {
    return 0.6
  }
  if (rate >= 20) {
    return 0.5
  }
  if (rate <= -4 && rate > -8) {
    return 1.1
  }
  if (rate <= -8 && rate > -12) {
    return 1.2
  }
  if (rate <= -12 && rate > -16) {
    return 1.3
  }
  if (rate <= -16 && rate > -20) {
    return 1.4
  }
  if (rate <= -20) {
    return 1.5
  }
  return 1
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
    let fixFlagCloseAll = 0
    let fixFlagCount = 0
    let fixFlagBuyAll = 0
    let countF = 0
    let step = 0
    let allCloseS = 0
    let countS = 0
    let upKeep = 0
    let closeAll = 0
    let closeAllCount = 0
    let closeAverage = 0
    let buyCount = 0
    let nowClose = (recentNetValue[0] && recentNetValue[0]['close']) || 0
    recentNetValue.forEach((item) => {
      closeAll += item['close']
      closeAllCount++
    })
    closeAverage = closeAll / closeAllCount
    console.log(`指数平均:${closeAverage}`)
    recentNetValue.forEach((item, index) => {
      xData.unshift(item['date']);
      yData.unshift(item['close']);
      const oneDayRecord = recentNetValue[index < recentNetValue.length - 1 ? index + 1 : index];
      const twoDayRecord = recentNetValue[index < recentNetValue.length - 2 ? index + 2 : index + 1];
      const threeDayRecord = recentNetValue[index + 3];
      const fourDayRecord = recentNetValue[index + 4];
      const fiveDayRecord = recentNetValue[index + 5];
      const sixDayRecord = recentNetValue[index + 6];
      let bugFlag = infoUtil[fnMap[this.props.nowType + 'Buy']](item, oneDayRecord, twoDayRecord);
      let sellFlag = infoUtil[fnMap[this.props.nowType + 'Sell']](item, oneDayRecord, twoDayRecord);
      // 按时间定投
      // if (step !== 7) {
      //   step++
      // } else {
      //   points.push({
      //     coord: [item['date'], item['close']],
      //     itemStyle: {
      //       normal: {
      //         color: 'black'
      //       }
      //     },
      //     label: {
      //       show: false
      //     }
      //   })
      //   allCloseS += item['close']
      //   countS++
      //   step = 0
      // }
      // //  && oneDayRecord['netChangeRatio'] < 0
      // let closeRate = numberUtil.countDifferenceRate(item['close'], closeAverage)
      // if (bugFlag.flag === true && bugFlag.text !== 'niu') {
      //   points.push({
      //     coord: [item['date'], item['close']],
      //     itemStyle: {
      //       normal: {
      //         color: 'red'
      //       }
      //     },
      //     label: {
      //       show: false
      //     }
      //   })
      //   buyCount += getBuyRate(closeRate) * 100
      //   fixFlagCloseAll += item['close']
      //   fixFlagBuyAll += item['close'] * getBuyRate(closeRate) * 100
      //   fixFlagCount++
      // } else if (bugFlag.flag === true && bugFlag.text === 'niu' && oneDayRecord['netChangeRatio'] < 0) {
      //   if (Math.abs(oneDayRecord['netChangeRatio']) > (rate / 2)) {
      //     points.push({
      //       coord: [item['date'], item['close']],
      //       itemStyle: {
      //         normal: {
      //           color: 'black'
      //         }
      //       },
      //       label: {
      //         show: false
      //       }
      //     })
      //     buyCount += getBuyRate(closeRate) * 100
      //     fixFlagCloseAll += item['close']
      //     fixFlagBuyAll += item['close'] * getBuyRate(closeRate) * 100
      //     fixFlagCount++
      //   }
      // }
      // if (sellFlag.flag === true) {
      //   points.push({
      //     coord: [item['date'], item['close']],
      //     itemStyle: {
      //       normal: {
      //         color: 'green'
      //       }
      //     },
      //     label: {
      //       show: false
      //     }
      //   })
      // }
      if (
        (twoDayRecord && twoDayRecord.netChangeRatio < 0) &&
        oneDayRecord.netChangeRatio < 0 &&
        item.netChangeRatio < 0
      ) {
        if ((
          twoDayRecord.netChangeRatio +
          oneDayRecord.netChangeRatio +
          item.netChangeRatio
        ) < -3.6) {
          points.push({
            coord: [item['date'], item['close'] + 50],
            itemStyle: {
              normal: {
                color: 'red'
              }
            },
            label: {
              show: false
            }
          })
        } else {
          points.push({
            coord: [item['date'], item['close'] + 50],
            itemStyle: {
              normal: {
                color: 'orange'
              }
            },
            label: {
              show: false
            }
          })
        }
      }
      // if (
      //   (fourDayRecord && fourDayRecord.netChangeRatio < 0) &&
      //   (threeDayRecord && threeDayRecord.netChangeRatio < 0) &&
      //   twoDayRecord.netChangeRatio < 0 &&
      //   oneDayRecord.netChangeRatio < 0 &&
      //   item.netChangeRatio < 0
      // ) {
      //   points.push({
      //     coord: [item['date'], item['close'] + 50],
      //     itemStyle: {
      //       normal: {
      //         color: 'black'
      //       }
      //     },
      //     label: {
      //       show: false
      //     }
      //   })
      // }
    });
    console.log(`策略点数:${fixFlagCount}`)
    console.log(`策略成本:${fixFlagCloseAll / fixFlagCount}`)
    console.log(`策略收益:${numberUtil.countDifferenceRate(nowClose * buyCount, fixFlagBuyAll)}`)
    console.log(`均值收益:${numberUtil.countDifferenceRate(nowClose, fixFlagCloseAll / fixFlagCount)}`)
    console.log(`定时点数:${countS}`)
    console.log(`定时成本:${allCloseS / countS}`)
    console.log(`定时均值收益:${numberUtil.countDifferenceRate(nowClose, allCloseS / countS)}`)
    return {
      title: {
        text: this.props.indexName + '净值变化',
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
        title: '盘中大幅下跌',
        width: 50,
        render: (record) => {
          const threshold = this.props.threshold;
          const rate = this.props.rate;
          const wave = this.props.wave;
          const infoConfig = {threshold, rate, wave};
          const infoUtil = new InfoUtil(infoConfig)
          const flag = infoUtil.ifSessionDownHigh(record);
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
        title: '收盘大幅拉起',
        width: 50,
        render: (record) => {
          const threshold = this.props.threshold;
          const rate = this.props.rate;
          const wave = this.props.wave;
          const infoConfig = {threshold, rate, wave};
          const infoUtil = new InfoUtil(infoConfig)
          const flag = infoUtil.ifSessionUpCloseHigh(record);
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
        title: '盘中大幅上升',
        width: 50,
        render: (record) => {
          const threshold = this.props.threshold;
          const rate = this.props.rate;
          const wave = this.props.wave;
          const infoConfig = {threshold, rate, wave};
          const infoUtil = new InfoUtil(infoConfig)
          const flag = infoUtil.ifSessionUpHigh(record);
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
        title: '收盘大幅回落',
        width: 50,
        render: (record) => {
          const threshold = this.props.threshold;
          const rate = this.props.rate;
          const wave = this.props.wave;
          const infoConfig = {threshold, rate, wave};
          const infoUtil = new InfoUtil(infoConfig)
          const flag = infoUtil.ifSessionDownCloseHigh(record);
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
        title: '大幅无抵抗',
        width: 50,
        render: (record) => {
          const threshold = this.props.threshold;
          const rate = this.props.rate;
          const wave = this.props.wave;
          const infoConfig = {threshold, rate, wave};
          const infoUtil = new InfoUtil(infoConfig)
          const flag = infoUtil.ifHighPreCloseDownHigh(record);
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
          flag.ifSessionDownHigh = infoUtil.ifSessionDownHigh(record)
          flag.ifSessionUpClose = infoUtil.ifSessionUpClose(record)
          flag.ifSessionUpCloseHigh = infoUtil.ifSessionUpCloseHigh(record)
          flag.ifSessionUp = infoUtil.ifSessionUp(record)
          flag.ifSessionUpHigh = infoUtil.ifSessionUpHigh(record)
          flag.ifSessionDownClose = infoUtil.ifSessionDownClose(record)
          flag.ifSessionDownCloseHigh = infoUtil.ifSessionDownCloseHigh(record)
          // flag.ifHighPreCloseDown = infoUtil.ifHighPreCloseDown(record)
          // flag.ifHighPreCloseDownHigh = infoUtil.ifHighPreCloseDownHigh(record)
          let str = JSON.stringify(flag)
          str = str.split(':').join(': ')
          str = str.split(',').join(', ')
          str = str.replace(/"/g, '\'')
          return <CopyToClipboard
            text={str}
            onCopy={() => {}}>
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
