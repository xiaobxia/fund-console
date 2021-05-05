<template>
  <div class="app-container">
    <div :id="id" :style="{height:'600px',width: '100%'}"/>
  </div>
</template>

<script>
import indexList from '@/common/indexList'
import echarts from 'echarts'
import moment from 'moment'

export default {
  name: 'BtbLineAll',
  data() {
    return {
      indexKey: 'chuangye',
      indexList,
      dataList: [],
      chart: null,
      indexItem: null,
      id: 'BtbLineAll'
    }
  },
  computed: {
  },
  watch: {
    indexKey() {
      this.initPage()
    }
  },
  mounted() {
    this.initPage()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    createPoint(date, value, color) {
      return {
        coord: [date, value],
        itemStyle: {
          normal: {
            color: color
          }
        },
        label: {
          show: false
        }
      }
    },
    countBuy(has, money, close) {
      // 之后要考虑进费率问题
      const shares = has.shares
      const sum = has.sum
      const buShares = money / close
      const resShares = shares + buShares
      const resMoney = sum + money
      const resCost = resMoney / (resShares || 1)
      return {
        shares: resShares,
        cost: resCost,
        sum: resMoney
      }
    },
    countSell(has, sellTime, close) {
      const shares = has.shares
      const cost = has.cost
      const sum = has.sum
      let r = 0
      if (sellTime === 1) {
        r = 2 / 3
      } else if (sellTime === 2) {
        r = 1 / 2
      } else if (sellTime === 3) {
        r = 0
      }
      return {
        has: {
          shares: shares * r,
          cost: cost,
          sum: sum * r
        },
        sellIncome: (close - cost) * shares * (1 - r)
      }
    },
    countBuy2(has, close, buyT) {
      // 之后要考虑进费率问题
      // 买入金额
      let money = 0
      let resBuyTimes = has.buyTimes
      // 次数到达
      if (has.buyTimes !== buyT) {
        // 买入金额
        money = (has.hasMoney * (1 / (buyT - has.buyTimes)))
        resBuyTimes++
      }
      // 份额
      const shares = has.shares
      const buShares = money / close
      const resShares = shares + buShares
      const resCostNetValue = (has.shares * has.costNetValue + money) / (resShares || 1)
      // 持仓金额
      const resPositionSum = resShares * close
      return {
        shares: resShares,
        costNetValue: resCostNetValue,
        positionCost: resShares * resCostNetValue,
        positionSum: resPositionSum,
        hasMoney: has.hasMoney - money,
        buyTimes: resBuyTimes,
        todayIncome: (has.shares * close) - has.positionSum,
        sellTimes: 0,
        flag: money > 0 ? '加仓' : ''
      }
    },
    // 好像和2没差距
    countBuy3(has, close, buyT) {
      const nowPosition = has.shares * close
      const allMoney = nowPosition + has.hasMoney
      // 之后要考虑进费率问题
      // 买入金额
      let money = 0
      let resBuyTimes = has.buyTimes
      // 次数到达
      if (has.buyTimes !== buyT) {
        // 买入金额
        money = (has.hasMoney * (1 / (buyT - has.buyTimes)))
        if (nowPosition > allMoney * ((has.buyTimes + 1) / 3)) {
          money = 0
        }
        resBuyTimes++
      }
      // 份额
      const shares = has.shares
      const buShares = money / close
      const resShares = shares + buShares
      const resCostNetValue = (has.shares * has.costNetValue + money) / (resShares || 1)
      // 持仓金额
      const resPositionSum = resShares * close
      return {
        shares: resShares,
        costNetValue: resCostNetValue,
        positionSum: resPositionSum,
        hasMoney: has.hasMoney - money,
        buyTimes: resBuyTimes,
        todayIncome: (has.shares * close) - has.positionSum,
        sellTimes: 0,
        flag: money > 0 ? '加仓' : ''
      }
    },
    countSell2(has, close, sellT) {
      // 卖出份额
      let sellShares = 0
      let resSellTimes = has.sellTimes
      let resCostNetValue = 0
      // 次数到达
      if (has.sellTimes !== sellT) {
        sellShares = (has.shares * (1 / (sellT - has.sellTimes)))
        resCostNetValue = has.costNetValue
        resSellTimes++
      }
      // 份额
      const resShares = has.shares - sellShares
      // 持仓金额
      const resPositionSum = resShares * close
      return {
        shares: resShares,
        costNetValue: resCostNetValue,
        positionCost: resShares * resCostNetValue,
        positionSum: resPositionSum,
        hasMoney: has.hasMoney + (close * sellShares),
        buyTimes: 0,
        todayIncome: (has.shares * close) - has.positionSum,
        sellTimes: resSellTimes,
        flag: sellShares > 0 ? '减仓' : ''
      }
    },
    pMoney(val) {
      return parseInt(parseFloat(val || 0) || 0)
    },
    countBuyKong(has, close, buyT) {
      // 买空金额
      let money = 0
      let resBuyTimes = has.buyTimes
      // 次数到达
      if (has.buyTimes !== buyT) {
        // 买空金额
        money = (has.hasMoney * (1 / (buyT - has.buyTimes)))
        resBuyTimes++
      }
      // 份额
      const shares = has.shares
      const buShares = money / close
      const resShares = shares + buShares
      const resCostNetValue = (has.shares * has.costNetValue + money) / (resShares || 1)
      // 持仓金额
      const resPositionSum = (resShares * resCostNetValue) * (resCostNetValue / close)
      return {
        shares: resShares,
        costNetValue: resCostNetValue,
        positionSum: resPositionSum,
        hasMoney: has.hasMoney - money,
        buyTimes: resBuyTimes,
        todayIncome: ((has.shares * has.costNetValue) * (has.costNetValue / close)) - has.positionSum,
        sellTimes: 0,
        flag: money > 0 ? '买空' : ''
      }
    },
    countSellKong(has, close, sellT) {
      // 卖出份额
      let sellShares = 0
      let resSellTimes = has.sellTimes
      let resCostNetValue = 0
      // 次数到达
      if (has.sellTimes !== sellT) {
        sellShares = (has.shares * (1 / (sellT - has.sellTimes)))
        resCostNetValue = has.costNetValue
        resSellTimes++
      }
      // 份额
      const resShares = has.shares - sellShares
      // 持仓金额
      const resPositionSum = (resShares * has.costNetValue) * (has.costNetValue / close)
      return {
        shares: resShares,
        costNetValue: resCostNetValue,
        positionSum: resPositionSum,
        hasMoney: has.hasMoney + ((sellShares * has.costNetValue) * (has.costNetValue / close)),
        buyTimes: 0,
        todayIncome: ((has.shares * has.costNetValue) * (has.costNetValue / close)) - has.positionSum,
        sellTimes: resSellTimes,
        flag: sellShares > 0 ? '平空' : ''
      }
    },
    initPage() {
      this.$http.get('stock/getBIKlines', {
        name: 'BTC'
      }).then((res) => {
        const list = []
        res.data.forEach((item) => {
          item.netChangeRatio = this.$countDifferenceRate(item.close, item.open)
          list.push(item)
        })
        // list = list.slice(0, 300)
        // list.reverse()
        this.dataList = list
        this.initChart()
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const recentNetValue = this.dataList
      // 均线
      const list5 = this.$getAverageList(recentNetValue, 5)
      const list10 = this.$getAverageList(recentNetValue, 10)
      const list20 = this.$getAverageList(recentNetValue, 20)
      const xData = []
      const yData = []
      const points = []
      // 最近的在前面
      const netChangeRatioAll = []
      const openList = []
      recentNetValue.forEach((item, index) => {
        xData.unshift(moment(item['tradeDate']).format('YYYY-MM-DD'))
        yData.unshift(item['close'])
        openList.unshift(item['open'])
        netChangeRatioAll.unshift(item.netChangeRatio)
      })
      // const buyMoney = 500
      // const has = {
      //   shares: 0,
      //   cost: 0,
      //   sum: 0
      // }
      // const sellTime = 0
      // const income = 0
      // const maxSum = 0
      // const hasIncome = 0
      //
      // let has2 = {
      //   shares: 0,
      //   cost: 0,
      //   sum: 0
      // }
      // let sellTime2 = 0
      // let sellIncome2 = 0
      // let maxSum2 = 0
      // let hasIncome2 = 0
      // let maxLoss = 0
      // const hasList = []
      // yData.forEach((item, index) => {
      //   const netChangeRatio = netChangeRatioAll[index]
      //   const date = xData[index]
      //   const close5 = list5[index]
      //   const close10 = list10[index]
      //   const close20 = list20[index]
      //   const rate5 = this.$countDifferenceRate(item, close5)
      //   const rate10 = this.$countDifferenceRate(item, close10)
      //   const rateM20 = this.$countDifferenceRate(item, close20)
      //   // if (close5 > close10) {
      //   //   sellTime = 0
      //   //   has = this.countBuy(has, buyMoney, item)
      //   // } else {
      //   //   sellTime++
      //   //   if (sellTime <= 3) {
      //   //     has = this.countSell(has, sellTime, item)
      //   //     income += has.income
      //   //     has.income = 0
      //   //   } else {
      //   //     sellTime = 0
      //   //   }
      //   // }
      //   // if (has.sum > maxSum) {
      //   //   maxSum = has.sum
      //   // }
      //   // if (index === (yData.length - 1)) {
      //   //   hasIncome = (item - has.cost) * has.shares
      //   // }
      //   // 策越2
      //   if (close5 > close10) {
      //     if (close5 < close20) {
      //       if (netChangeRatio < 0) {
      //         sellTime2 = 0
      //         has2 = this.countBuy(has2, buyMoney, item)
      //       }
      //     } else {
      //       sellTime2 = 0
      //       has2 = this.countBuy(has2, buyMoney, item)
      //     }
      //     // sellTime2 = 0
      //     // has2 = this.countBuy(has2, buyMoney, item)
      //   } else {
      //     if (close5 > close20) {
      //       if (netChangeRatio > 0) {
      //         sellTime2++
      //         if (sellTime2 <= 3) {
      //           const ss = this.countSell(has2, sellTime2, item)
      //           has2 = ss.has
      //           sellIncome2 += ss.sellIncome
      //         } else {
      //           sellTime2 = 0
      //         }
      //       }
      //     } else {
      //       sellTime2++
      //       if (sellTime2 <= 3) {
      //         const ss = this.countSell(has2, sellTime2, item)
      //         has2 = ss.has
      //         sellIncome2 += ss.sellIncome
      //       } else {
      //         sellTime2 = 0
      //       }
      //     }
      //     // sellTime2++
      //     // if (sellTime2 <= 3) {
      //     //   const ss = this.countSell(has2, sellTime2, item)
      //     //   has2 = ss.has
      //     //   sellIncome2 += ss.sellIncome
      //     // } else {
      //     //   sellTime2 = 0
      //     // }
      //   }
      //   const hasSUm = has2.shares * item
      //   if (hasSUm > maxSum2) {
      //     maxSum2 = hasSUm
      //   }
      //   const hasIn = (item - has2.cost) * has2.shares
      //   if (index === (yData.length - 1)) {
      //     hasIncome2 = hasIn
      //   }
      //   const incomeSum = sellIncome2 + hasIn
      //   if (incomeSum < maxLoss) {
      //     maxLoss = incomeSum
      //   }
      //   hasList.push({
      //     date,
      //     incomeSum,
      //     ...has2
      //   })
      // })
      // // console.log('最大仓位', maxSum)
      // // console.log('持有收益', hasIncome)
      // // console.log('了结收益', income)
      // // console.log('总收益', income + hasIncome)
      // console.log('最大仓位2', maxSum2)
      // console.log('持有收益2', hasIncome2)
      // console.log('了结收益2', sellIncome2)
      // console.log('总收益2', sellIncome2 + hasIncome2)
      // console.log('最大亏损2', maxLoss)
      const benjin = 10000
      let has2 = {
        shares: 0,
        costNetValue: 0,
        positionSum: 0,
        hasMoney: benjin,
        buyTimes: 0,
        todayIncome: 0,
        sellTimes: 0,
        flag: ''
      }
      const dayInfoList = []
      const kBase = yData[0]
      // const points = []
      yData.forEach((item, index) => {
        const netChangeRatio = netChangeRatioAll[index]
        const date = xData[index]
        const close5 = list5[index]
        const close10 = list10[index]
        const close20 = list20[index]
        const rate5 = this.$countDifferenceRate(item, close5)
        const rate10 = this.$countDifferenceRate(item, close10)
        const rateM20 = this.$countDifferenceRate(item, close20)
        const open = openList[index]
        // 策略1
        // if (close5 > close10) {
        //   // 买入
        //   has2 = this.countBuy2(has2, item, 3)
        // } else {
        //   has2 = this.countSell2(has2, item, 3)
        // }
        // 策略2
        // if (close5 > close10) {
        //   // 买入
        //   has2 = this.countBuy2(has2, open, 1)
        // } else {
        //   has2 = this.countSell2(has2, item, 2)
        // }
        // 买入最好策略
        // if (close5 > close10) {
        //   // 买入
        //   has2 = this.countBuy2(has2, open, 1)
        // } else {
        //   has2 = this.countSell2(has2, item, 2)
        // }
        // TODO 最好的
        if (close5 > close10) {
          // 买入
          // if (close5 > close20) {
          //   has2 = this.countBuy2(has2, open, 1)
          // } else {
          //   has2 = this.countBuy2(has2, open, 2)
          // }
          has2 = this.countBuy2(has2, open, 1)
        } else {
          if (close5 > close20) {
            has2 = this.countSell2(has2, item, 2)
          } else {
            has2 = this.countSell2(has2, open, 1)
          }
        }
        // if (close5 > close10) {
        //   // 买入
        //   has2 = this.countBuy2(has2, open, 1)
        // } else {
        //   has2 = this.countSell2(has2, item, 2)
        // }
        // 策略三
        // if (close5 > close10) {
        //   // 买入
        //   if (close5 < close20) {
        //     if (netChangeRatio < 0) {
        //       has2 = this.countBuy2(has2, item, 3)
        //     }
        //   } else {
        //     has2 = this.countBuy2(has2, item, 3)
        //   }
        // } else {
        //   if (close5 > close20) {
        //     if (netChangeRatio > 0) {
        //       has2 = this.countSell2(has2, item, 2)
        //     }
        //   } else {
        //     has2 = this.countSell2(has2, item, 2)
        //   }
        // }
        // 空单（目前最好策略）
        // if (close5 < close10) {
        //   // 买入
        //   has2 = this.countBuyKong(has2, item, 1)
        // } else {
        //   has2 = this.countSellKong(has2, open, 2)
        // }
        dayInfoList.push({
          '总金': this.pMoney(has2.positionSum + has2.hasMoney),
          '点位': item,
          '日期': date,
          '日盈亏': this.pMoney(has2.todayIncome),
          '持仓盈亏率': this.$countDifferenceRate(has2.positionSum, has2.positionCost),
          '持仓': this.pMoney(has2.positionSum),
          '现金': this.pMoney(has2.hasMoney),
          '操作': has2.flag,
          // '总金收益': this.$countDifferenceRate(this.pMoney(has2.positionSum + has2.hasMoney), benjin) + '%',
          // '点位收益': this.$countDifferenceRate(item, kBase) + '%',
          ...has2
        })
      })
      let maxDown = 0
      // let day = ''
      // const maxList = []
      dayInfoList.forEach((v) => {
        if (v['持仓盈亏率'] < maxDown) {
          maxDown = v['持仓盈亏率']
        }
        // maxList.push({
        //   todayIncome: v.todayIncome,
        //   date: v['日期']
        // })
      })
      // maxList.sort((a, b) => {
      //   return a.todayIncome - b.todayIncome
      // })
      // console.log(day)
      let addDay = 0
      let downDay = 0
      let kongDay = 0
      dayInfoList.forEach((v) => {
        if (v.flag === '减仓') {
          downDay++
        }
        if (v.flag === '加仓') {
          addDay++
        }
        if (v['持仓'] === 0) {
          kongDay++
        }
      })
      console.log('日志', dayInfoList)
      console.log('持仓亏损极限', maxDown)
      console.log('加仓天数', addDay)
      console.log('减仓天数', downDay)
      console.log('空仓天数', kongDay)
      // console.log(points)
      const yBase = yData[0]
      const yData2 = []
      yData.forEach((v) => {
        yData2.push(this.$countDifferenceRate(v, yBase))
      })
      const yData3 = []
      dayInfoList.forEach((v) => {
        const r = this.$countDifferenceRate(v['总金'], benjin)
        yData3.push(r)
        if (v.flag === '减仓') {
          points.push(this.createPoint(v['日期'], r, 'green'))
        }
        if (v.flag === '加仓') {
          points.push(this.createPoint(v['日期'], r, 'red'))
        }
      })
      // console.log(hasList)
      this.chart.setOption({
        title: {
          text: '线变化',
          left: 'center',
          textStyle: {
            color: 'rgba(0, 0, 0, 0.85)',
            fontWeight: '500'
          }
        },
        grid: {
          left: '4%',
          right: '3%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        // dataZoom: [
        //   {
        //     show: true,
        //     start: 70,
        //     end: 100
        //   },
        //   {
        //     type: 'inside',
        //     start: 70,
        //     end: 100
        //   }
        // ],
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'value',
          name: '点数',
          scale: true,
          splitLine: {
            show: false
          }
        },
        series: [
          {
            name: '线',
            data: yData2,
            type: 'line',
            lineStyle: {
              color: '#909399'
            },
            smooth: false,
            symbol: 'none',
            markPoint: {
              data: points,
              symbol: 'circle',
              symbolSize: 4
            }
          },
          {
            name: '净值线',
            data: yData3,
            type: 'line',
            lineStyle: {
              color: '#409EFF'
            },
            smooth: false,
            symbol: 'none'
          }
          // {
          //   name: 'K线',
          //   data: yData,
          //   type: 'line',
          //   lineStyle: {
          //     color: '#409EFF'
          //   },
          //   smooth: false,
          //   symbol: 'none',
          //   markPoint: {
          //     data: points,
          //     symbol: 'circle',
          //     symbolSize: 4
          //   },
          //   markLine: {
          //     silent: true,
          //     data: [{
          //       yAxis: recentNetValue[0].close,
          //       lineStyle: {
          //         color: '#aaa'
          //       }
          //     }]
          //   }
          // }
          // {
          //   name: '5日线',
          //   data: list5,
          //   type: 'line',
          //   lineStyle: {
          //     color: '#606266'
          //   },
          //   smooth: false,
          //   symbol: 'none'
          // },
          // {
          //   name: '10日线',
          //   data: list10,
          //   type: 'line',
          //   lineStyle: {
          //     color: '#909399'
          //   },
          //   smooth: false,
          //   symbol: 'none'
          // },
          // {
          //   name: '20日线',
          //   data: list20,
          //   type: 'line',
          //   lineStyle: {
          //     color: '#C0C4CC'
          //   },
          //   smooth: false,
          //   symbol: 'none'
          // }
        ]
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .r-w {
    margin-bottom: 30px;
  }
</style>
