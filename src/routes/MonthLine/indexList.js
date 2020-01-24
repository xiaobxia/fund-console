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
    const recentNetValue2 = getAverageList(recentNetValue, 120)
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
      // console.log(averageList)
      let noSell = ifNoSell(averageList)
      let rate = numberUtil.countDifferenceRate(item, yData3[index])
      // 移动均线策略
      let now = 0
      let last = 0
      let c = true
      // 近的在前
      for (let i = 0; i < 7; i++) {
        if (yData[index - i]) {
          now += parseFloat(yData[index - i])
        }
      }
      for (let j = 1; j < 8; j++) {
        if (yData[index - j]) {
          last += parseFloat(yData[index - j])
        }
      }
      const diff = numberUtil.countDifferenceRate(now / 7, last / 7)
      console.log(now)
      console.log(last)
      console.log(diff)
      if (diff < 0.2) {
        c = false
      }
      // yData4.push({
      //   value: rate,
      //   itemStyle: {
      //     color: rate >= average ? 'rgb(208, 153, 183)' : (rate >= 0 ? 'rgb(112, 220, 240)' : 'rgb(254, 255, 153)')
      //   }
      // });
      yData4.push({
        value: rate,
        itemStyle: {
          color: noSell ? (c ? 'rgb(208, 153, 183)' : 'rgb(0, 0, 0)') : 'rgb(112, 220, 240)'
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
        {
          name: '均线',
          data: yData2,
          type: 'line',
          lineStyle: {
            color: '#a80'
          },
          smooth: false,
          symbol: 'none'
        },
        {
          name: '均线2',
          data: yData3,
          type: 'line',
          lineStyle: {
            color: 'rgb(132, 7, 189)'
          },
          smooth: false,
          symbol: 'none'
        },
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
      </div>
    );
  }
}
export default IndexList;
