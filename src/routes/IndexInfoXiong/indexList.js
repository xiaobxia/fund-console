/**
 * Created by xiaobxia on 2018/1/26.
 */
import React, {PureComponent} from 'react'
import {Table, Button, Divider, Popconfirm} from 'antd';
import {Link} from 'react-router-dom'
import numberUtil from 'localUtil/numberUtil';
import stockAnalysisUtil from 'localUtil/stockAnalysisUtil';
import indexInfoUtil from 'localUtil/indexInfoUtilXiong';
import ReactEcharts from 'echarts-for-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

const fnMap = indexInfoUtil.fnMap;
const InfoUtil = indexInfoUtil.Util;

const functionName = 'ifBuyChuangye'
let hide = 'sell'
let showLow = true

let isDev = process.env.NODE_ENV !== 'production'

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

function ifUpAll (closeList, now) {
  for (let i = 0; i < closeList.length; i++) {
    if (closeList[i] > now) {
      return false
    }
  }
  return true
}

function ifDownAll (closeList, now) {
  console.log(closeList)
  for (let i = 0; i < closeList.length; i++) {
    if (closeList[i] < now) {
      return false
    }
  }
  return true
}

function addDownPoints(points, item, color) {
  points.push({
    coord: [item['date'], item['close']],
    itemStyle: {
      normal: {
        color: color || '#8600ff'
      }
    },
    label: {
      show: false
    }
  })
}


class IndexList extends PureComponent {

  getChartOption = () => {
    const threshold = this.props.threshold;
    const rate = this.props.rate;
    const indexRate = this.props.rate;
    const wave = this.props.wave;
    const infoConfig = {threshold, rate, wave};
    let recentNetValue = this.props.dataSource;
    const infoUtil = new InfoUtil(infoConfig)
    // 均线
    const recentNetValue2 = getAverageList(recentNetValue, 120)
    const recentNetValue3 = getAverageList(recentNetValue, 20)
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
    // 20天线差值
    let inList = []
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
      let noSell = stockAnalysisUtil.ifNoSell(averageList)
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
      if (diff < 0.2) {
        c = false
      }
      yData4.push({
        value: rate,
        itemStyle: {
          color: noSell ? (c ? 'rgb(208, 153, 183)' : 'rgb(0, 0, 0)') : 'rgb(112, 220, 240)'
        }
      });
      if (noSell && c) {
        inList.push(index)
      }
    })
    let downTrendList = []
    // 120天线差值
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
      if (rate <= -3.3) {
        downTrendList.push(index)
      }
    })

    let downInList = []
    let allLength = netChangeRatioAll.length
    // 画点
    netChangeRatioAll.forEach((item, index) => {
      // 最后几个不要
      if (allLength - 10 <= index) {
        return false
      }
      const netChangeRatioList = getNetChangeRatioList(netChangeRatioAll, index)
      let twoDay = stockAnalysisUtil.countDown(netChangeRatioList, 2, 2)
      let threeDay = stockAnalysisUtil.countDown(netChangeRatioList, 3, 3)
      if (stockAnalysisUtil.countDown(netChangeRatioList, 9, 7).flag) {
        downInList.push(index)
        addDownPoints(points, recentNetValue[index])
        return false
      }
      if (stockAnalysisUtil.countDown(netChangeRatioList, 8, 6).flag) {
        downInList.push(index)
        addDownPoints(points, recentNetValue[index])
        return false
      }
      if (stockAnalysisUtil.countDown(netChangeRatioList, 8, 7).flag) {
        downInList.push(index)
        addDownPoints(points, recentNetValue[index])
        return false
      }
      if (stockAnalysisUtil.countDown(netChangeRatioList, 7, 6).flag) {
        downInList.push(index)
        addDownPoints(points, recentNetValue[index])
        return false
      }
      if (stockAnalysisUtil.countDown(netChangeRatioList, 5, 5).flag) {
        downInList.push(index)
        addDownPoints(points, recentNetValue[index])
        return false
      }
      if (stockAnalysisUtil.countDown(netChangeRatioList, 4, 4).flag) {
        downInList.push(index)
        addDownPoints(points, recentNetValue[index])
        return false
      }
      if (stockAnalysisUtil.countDown(netChangeRatioList, 6, 5).flag) {
        downInList.push(index)
        addDownPoints(points, recentNetValue[index])
        return false
      }
      if (threeDay.flag && threeDay.rate < -(3 * indexRate)) {
        downInList.push(index)
        addDownPoints(points, recentNetValue[index])
        return false
      }
      if (twoDay.flag && twoDay.rate < -(3 * indexRate)) {
        downInList.push(index)
        addDownPoints(points, recentNetValue[index], 'black')
        return false
      }
    })

    recentNetValue.forEach((item, index) => {
      // 大小反的不在重复
      if (downInList.indexOf(index) !== -1) {
        return false
      }
      const rIndex = allLength - 1 - index
      const oneDayRecord = recentNetValue[index < recentNetValue.length - 1 ? index + 1 : index];
      const twoDayRecord = recentNetValue[index < recentNetValue.length - 2 ? index + 2 : index];
      let bugFlag = infoUtil[fnMap[this.props.nowType + 'Buy']](item, oneDayRecord, twoDayRecord);
      let sellFlag = infoUtil[fnMap[this.props.nowType + 'Sell']](item, oneDayRecord, twoDayRecord);
      if (hide !== 'buy' && ((bugFlag === true) || (bugFlag !== false && bugFlag.flag === true))) {
        // 下降趋势不买
        if (downTrendList.indexOf(rIndex) !== -1) {
          return false
        }
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

    // let yData5 = []
    // recentNetValue.forEach((item, index) => {
    //   let now = 0
    //   let last = 0
    //   let diff = 0
    //   let day = 7
    //   if (index + day < recentNetValue.length) {
    //     // 近的在前
    //     for (let i = index; i < (day + index); i++) {
    //       now += parseFloat(recentNetValue[i].close)
    //     }
    //     for (let j = (1 + index); j < ((day + 1) + index); j++) {
    //       last += parseFloat(recentNetValue[j].close)
    //     }
    //     diff = numberUtil.countDifferenceRate(now / day, last / day)
    //   } else {
    //     diff = 0
    //   }
    //   yData5.unshift({
    //     value: diff,
    //     itemStyle: {
    //       color: diff >= 0.2 ? 'rgb(208, 153, 183)' : 'rgb(112, 220, 240)'
    //     }
    //   });
    //   let ind = recentNetValue.length - 1 - index
    //   if (!(diff >= 0.2)) {
    //     if (inList.indexOf(ind) !== -1) {
    //       points.push({
    //         coord: [xData[ind], yData[ind]],
    //         itemStyle: {
    //           normal: {
    //             color: 'green'
    //           }
    //         },
    //         label: {
    //           show: false
    //         }
    //       })
    //     }
    //   }
    // })

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
