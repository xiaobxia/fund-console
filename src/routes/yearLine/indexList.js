/**
 * Created by xiaobxia on 2018/1/26.
 */
import React, {PureComponent} from 'react'
import {Table, Button, Divider, Popconfirm} from 'antd';
import {Link} from 'react-router-dom'
import stockAnalysisUtil from 'localUtil/stockAnalysisUtil';
import indexInfoUtil from 'localUtil/indexInfoUtilXiong';
import numberUtil from 'localUtil/numberUtil';
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

function getNetChangeRatioList (list, index) {
  const newList = []
  for (let i = 0; i < 10; i++) {
    newList.push(list[index + i])
  }
  return newList
}

class IndexList extends PureComponent {

  getChartOption = () => {
    const indexRate = this.props.rate;
    let recentNetValue = this.props.dataSource;
    // 均线
    const recentNetValue2 = getAverageList(recentNetValue, 250)
    const recentNetValue3 = getAverageList(recentNetValue, 120)
    let xData = [];
    let yData = [];
    let yData2 = [];
    let yData3 = [];
    let points = [];
    let netChangeRatioAll = []
    recentNetValue2.forEach((item) => {
      yData2.push(item);
    })
    recentNetValue3.forEach((item) => {
      yData3.push(item);
    })
    recentNetValue.forEach((item, index) => {
      xData.unshift(item['date']);
      yData.unshift(item['close']);
      netChangeRatioAll.push(item.netChangeRatio)
    });
    // 线差值
    let yData4 = []
    yData.forEach((item, index) => {
      const day = 5
      let averageList = []
      if (index >= day) {
        for (let i = day; i >= 0; i--) {
          let nowIndex = index - i
          averageList.push(numberUtil.countDifferenceRate(yData[nowIndex], yData2[nowIndex]))
        }
      }
      let rate = numberUtil.countDifferenceRate(item, yData2[index])
      yData4.push({
        value: rate,
        itemStyle: {
          color: rate >= 0 ? 'rgb(208, 153, 183)' : 'rgb(112, 220, 240)'
        }
      });
    })
    let allLength = netChangeRatioAll.length
    // 画点
    netChangeRatioAll.forEach((item, index) => {
      // 最后几个不要
      if (allLength - 10 <= index) {
        return false
      }
      let show = true
      const nowKline = recentNetValue[index]
      const netChangeRatioList = getNetChangeRatioList(netChangeRatioAll, index)
      let threeDay = stockAnalysisUtil.countDown(netChangeRatioList, 3, 3)
      if (threeDay.flag && threeDay.rate < -(3 * indexRate)) {
        if (show) {
          points.push({
            coord: [nowKline['date'], nowKline['close'] - (nowKline['close'] / 40)],
            itemStyle: {
              normal: {
                color: '#ff0000'
              }
            },
            label: {
              show: false
            }
          })
        } else {
          return false
        }
      }
      if (stockAnalysisUtil.countDown(netChangeRatioList, 6, 5).flag) {
        if (show) {
          points.push({
            coord: [nowKline['date'], nowKline['close'] - (nowKline['close'] / 40)],
            itemStyle: {
              normal: {
                color: '#ff0000'
              }
            },
            label: {
              show: false
            }
          })
        } else {
          return false
        }
      }
      if (stockAnalysisUtil.countDown(netChangeRatioList, 4, 4).flag) {
        if (show) {
          points.push({
            coord: [nowKline['date'], nowKline['close'] - (nowKline['close'] / 40)],
            itemStyle: {
              normal: {
                color: '#ff0000'
              }
            },
            label: {
              show: false
            }
          })
        } else {
          return false
        }
      }
      if (stockAnalysisUtil.countDown(netChangeRatioList, 5, 5).flag) {
        if (show) {
          points.push({
            coord: [nowKline['date'], nowKline['close'] - (nowKline['close'] / 40)],
            itemStyle: {
              normal: {
                color: 'black'
              }
            },
            label: {
              show: false
            }
          })
        } else {
          return false
        }
      }
      if (stockAnalysisUtil.countDown(netChangeRatioList, 7, 6).flag) {
        if (show) {
          points.push({
            coord: [nowKline['date'], nowKline['close'] - (nowKline['close'] / 40)],
            itemStyle: {
              normal: {
                color: 'black'
              }
            },
            label: {
              show: false
            }
          })
        } else {
          return false
        }
      }
      if (stockAnalysisUtil.countDown(netChangeRatioList, 8, 7).flag) {
        if (show) {
          points.push({
            coord: [nowKline['date'], nowKline['close'] - (nowKline['close'] / 40)],
            itemStyle: {
              normal: {
                color: 'black'
              }
            },
            label: {
              show: false
            }
          })
        } else {
          return false
        }
      }
      if (stockAnalysisUtil.countDown(netChangeRatioList, 8, 6).flag) {
        if (show) {
          points.push({
            coord: [nowKline['date'], nowKline['close'] - (nowKline['close'] / 40)],
            itemStyle: {
              normal: {
                color: 'black'
              }
            },
            label: {
              show: false
            }
          })
        } else {
          return false
        }
      }
      if (stockAnalysisUtil.countDown(netChangeRatioList, 9, 7).flag) {
        if (show) {
          points.push({
            coord: [nowKline['date'], nowKline['close'] - (nowKline['close'] / 40)],
            itemStyle: {
              normal: {
                color: 'black'
              }
            },
            label: {
              show: false
            }
          })
        } else {
          return false
        }
      }
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
