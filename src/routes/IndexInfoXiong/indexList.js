/**
 * Created by xiaobxia on 2018/1/26.
 */
import React, {PureComponent} from 'react'
import {Table, Button, Divider, Popconfirm} from 'antd';
import {Link} from 'react-router-dom'
import numberUtil from 'localUtil/numberUtil';
import indexInfoUtil from 'localUtil/indexInfoUtilXiong';
import ReactEcharts from 'echarts-for-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const fnMap = indexInfoUtil.fnMap;
const InfoUtil = indexInfoUtil.Util;

const functionName = 'ifSellChuangye'
let hide = 'buy'
let showLow = true

const isDev = process.env.NODE_ENV !== 'production'

if (!isDev) {
  hide = false
}

function getAverageList (netValue, day) {
  let list = []
  let newList = []
  netValue.forEach((item) => {
    newList.unshift(item)
  })
  newList.forEach((item, index) => {
    const average = getAverage(newList, day, index)
    list.push(average)
  })
  return list
}
function getAverage (netValue, day, index) {
  let start = index - day + 1
  start = start < 0 ? 0 : start
  let count = 0
  for (let i = index; i >= start; i--) {
    count += netValue[i]['close']
  }
  return numberUtil.keepTwoDecimals(count / (index + 1 - start))
}

function ifNoSell(averageList) {
  let last = averageList[averageList.length - 1]
  let lastTwo = averageList[averageList.length - 2]
  if (last > 0) {
    let max = 0
    let maxIndex = 0
    for (let i = 0; i < (averageList.length - 2); i++) {
      let now = averageList[i]
      if (now > max) {
        max = now
        maxIndex = i
      }
    }
    if (max <= 0) {
      if (lastTwo > 0) {
        return true
      }
      return false
    } else {
      for (let j = maxIndex; j < averageList.length; j++) {
        let now = averageList[j]
        if (now < (max * 0.5)) {
          return false
        }
      }
      return true
    }
  }
  return false
}

class IndexList extends PureComponent {

  getChartOption = () => {
    const threshold = this.props.threshold;
    const rate = this.props.rate;
    const wave = this.props.wave;
    const average = this.props.average;
    const infoConfig = {threshold, rate, wave};
    let recentNetValue = this.props.dataSource;
    // recentNetValue = recentNetValue.slice(150)
    // console.log(recentNetValue)
    const infoUtil = new InfoUtil(infoConfig)
    // 均线
    const recentNetValue2 = getAverageList(recentNetValue, 60)
    const recentNetValue3 = getAverageList(recentNetValue, 20)
    let xData = [];
    let yData = [];
    let yData2 = [];
    let yData3 = [];
    let points = [];
    recentNetValue2.forEach((item) => {
      yData2.push(item);
    })
    recentNetValue3.forEach((item) => {
      yData3.push(item);
    })
    recentNetValue.forEach((item, index) => {
      xData.unshift(item['date']);
      yData.unshift(item['close']);
      const oneDayRecord = recentNetValue[index < recentNetValue.length - 1 ? index + 1 : index];
      const twoDayRecord = recentNetValue[index < recentNetValue.length - 2 ? index + 2 : index];
      const threeDayRecord = recentNetValue[index + 3];
      const fourDayRecord = recentNetValue[index + 4];
      const fiveDayRecord = recentNetValue[index + 5];
      const sixDayRecord = recentNetValue[index + 6];
      const sevenDayRecord = recentNetValue[index + 7];
      const eightDayRecord = recentNetValue[index + 8];
      let bugFlag = infoUtil[fnMap[this.props.nowType + 'Buy']](item, oneDayRecord, twoDayRecord);
      let sellFlag = infoUtil[fnMap[this.props.nowType + 'Sell']](item, oneDayRecord, twoDayRecord);
      if (isDev) {
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
      }
      let open = true
      if (open) {
        // 跌3天
        if (oneDayRecord && twoDayRecord && threeDayRecord && fourDayRecord && fiveDayRecord) {
          if (
            item.netChangeRatio < 0 &&
            oneDayRecord.netChangeRatio < 0 &&
            twoDayRecord.netChangeRatio < 0
          ) {
            points.push({
              coord: [item['date'], item['close'] - (item['close'] / 40)],
              itemStyle: {
                normal: {
                  color: '#ffb5b5'
                }
              },
              label: {
                show: false
              }
            })
          }
        }
        // 6跌5
        if (oneDayRecord && twoDayRecord && threeDayRecord && fourDayRecord && fiveDayRecord) {
          if (item.netChangeRatio < 0 && fiveDayRecord.netChangeRatio < 0) {
            let count = 0
            if (oneDayRecord.netChangeRatio > 0) {
              count++
            }
            if (twoDayRecord.netChangeRatio > 0) {
              count++
            }
            if (threeDayRecord.netChangeRatio > 0) {
              count++
            }
            if (fourDayRecord.netChangeRatio > 0) {
              count++
            }
            if (count < 2) {
              points.push({
                coord: [item['date'], item['close'] - (item['close'] / 40)],
                itemStyle: {
                  normal: {
                    color: '#e6caff'
                  }
                },
                label: {
                  show: false
                }
              })
            }
          }
        }
        // 7跌6
        if (oneDayRecord && twoDayRecord && threeDayRecord && fourDayRecord && fiveDayRecord && sixDayRecord) {
          if (item.netChangeRatio < 0 && sixDayRecord.netChangeRatio < 0) {
            let count = 0
            if (oneDayRecord.netChangeRatio > 0) {
              count++
            }
            if (twoDayRecord.netChangeRatio > 0) {
              count++
            }
            if (threeDayRecord.netChangeRatio > 0) {
              count++
            }
            if (fourDayRecord.netChangeRatio > 0) {
              count++
            }
            if (fiveDayRecord.netChangeRatio > 0) {
              count++
            }
            if (count < 2) {
              points.push({
                coord: [item['date'], item['close'] - (item['close'] / 40)],
                itemStyle: {
                  normal: {
                    color: '#8600ff'
                  }
                },
                label: {
                  show: false
                }
              })
            }
          }
        }
        // 跌4天
        if (oneDayRecord && twoDayRecord && threeDayRecord && fourDayRecord && fiveDayRecord) {
          if (
            item.netChangeRatio < 0 &&
            oneDayRecord.netChangeRatio < 0 &&
            twoDayRecord.netChangeRatio < 0 &&
            threeDayRecord.netChangeRatio < 0
          ) {
            points.push({
              coord: [item['date'], item['close'] - (item['close'] / 40)],
              itemStyle: {
                normal: {
                  color: '#ff0000'
                }
              },
              label: {
                show: false
              }
            })
          }
        }
        // 跌5天
        if (oneDayRecord && twoDayRecord && threeDayRecord && fourDayRecord && fiveDayRecord) {
          if (
            item.netChangeRatio < 0 &&
            oneDayRecord.netChangeRatio < 0 &&
            twoDayRecord.netChangeRatio < 0 &&
            threeDayRecord.netChangeRatio < 0 &&
            fourDayRecord.netChangeRatio < 0
          ) {
            points.push({
              coord: [item['date'], item['close'] - (item['close'] / 40)],
              itemStyle: {
                normal: {
                  color: 'black'
                }
              },
              label: {
                show: false
              }
            })
          }
        }
        //涨3
        if (oneDayRecord && twoDayRecord && threeDayRecord && fourDayRecord && fiveDayRecord) {
          if (
            item.netChangeRatio > 0 &&
            oneDayRecord.netChangeRatio > 0 &&
            twoDayRecord.netChangeRatio > 0
          ) {
            points.push({
              coord: [item['date'], item['close'] + (item['close'] / 40)],
              itemStyle: {
                normal: {
                  color: '#bbffbb'
                }
              },
              label: {
                show: false
              }
            })
          }
        }
        // 涨4
        if (oneDayRecord && twoDayRecord && threeDayRecord && fourDayRecord && fiveDayRecord) {
          if (
            item.netChangeRatio > 0 &&
            oneDayRecord.netChangeRatio > 0 &&
            twoDayRecord.netChangeRatio > 0 &&
            threeDayRecord.netChangeRatio > 0
          ) {
            points.push({
              coord: [item['date'], item['close'] + (item['close'] / 40)],
              itemStyle: {
                normal: {
                  color: '#00a600'
                }
              },
              label: {
                show: false
              }
            })
          }
        }
      }
    });
    // 20天线差值
    let yData4 = []
    yData.forEach((item, index) => {
      const day = 5
      let averageList = []
      if (index >= day) {
        for (let i = day; i >= 0; i--) {
          let nowIndex = index - i
          averageList.push(numberUtil.countDifferenceRate(yData[nowIndex], yData3[nowIndex]))
        }
      }
      let noSell = ifNoSell(averageList)
      let rate = numberUtil.countDifferenceRate(item, yData3[index])
      // yData4.push({
      //   value: rate,
      //   itemStyle: {
      //     color: rate >= average ? 'rgb(208, 153, 183)' : (rate >= 0 ? 'rgb(112, 220, 240)' : 'rgb(254, 255, 153)')
      //   }
      // });
      yData4.push({
        value: rate,
        itemStyle: {
          color: noSell ? 'rgb(208, 153, 183)' : 'rgb(112, 220, 240)'
        }
      });
    })
    return {
      title: {
        text: '净值变化',
        left: 'center',
        textStyle: {
          color: 'rgba(0, 0, 0, 0.85)',
          fontWeight: '500'
        }
      },
      grid: {
        left: '5%',
        right: '5%'
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
      yAxis: [
        {
          type: 'value',
          name: '点数',
          scale: true
        },
        {
          type: 'value',
          name: '差值'
        }
      ],
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
        },
        // {
        //   name: '均线',
        //   data: yData2,
        //   type: 'line',
        //   lineStyle: {
        //     color: '#a80'
        //   },
        //   smooth: false,
        //   symbol: 'none'
        // },
        // {
        //   name: '均线2',
        //   data: yData3,
        //   type: 'line',
        //   lineStyle: {
        //     color: 'rgb(132, 7, 189)'
        //   },
        //   smooth: false,
        //   symbol: 'none'
        // },
        // {
        //   name: '均线3',
        //   data: yData2,
        //   type: 'line',
        //   lineStyle: {
        //     color: 'rgb(255, 130, 255)'
        //   },
        //   smooth: false,
        //   symbol: 'none'
        // },
        {
          name: '差值',
          data: yData4,
          yAxisIndex: 1,
          type: 'bar'
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
          style={{height: '500px'}}
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
