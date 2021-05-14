<template>
  <div class="app-container">
    <div :id="id" :style="{height:'600px',width: '100%'}"/>
  </div>
</template>

<script>
import indexList from '@/common/indexList'
import echarts from 'echarts'
import moment from 'moment'
import macd from '@/utils/macd'

export default {
  name: 'BtbLineAll',
  data() {
    return {
      indexKey: 'chuangye',
      indexList,
      dataList: [],
      chart: null,
      indexItem: null,
      id: 'BtbLineAll',
      macdList: [],
      maxLine: 0
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
    countBuy2(has, close, buyT) {
      // 之后要考虑进费率问题
      // 买入金额
      let money = 0
      let resBuyTimes = has.buyTimes
      // 次数到达
      if (has.lastBuyTimes && has.lastBuyTimes !== buyT) {
        money = (has.hasMoney * (1 / (buyT)))
        resBuyTimes = 1
      } else {
        if (has.buyTimes !== buyT) {
          // 买入金额
          money = (has.hasMoney * (1 / (buyT - has.buyTimes)))
          resBuyTimes++
        }
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
        lastBuyTimes: buyT,
        todayIncome: (has.shares * close) - has.positionSum,
        sellTimes: 0,
        lastSellTimes: 0,
        flag: money > 0 ? '加仓' : ''
      }
    },
    countSell2(has, close, sellT) {
      // 卖出份额
      let sellShares = 0
      let resSellTimes = has.sellTimes
      let resCostNetValue = 0
      // 上一次和这次一样
      if (has.lastSellTimes && has.lastSellTimes !== sellT) {
        // 次数变了
        sellShares = (has.shares * (1 / (sellT)))
        resCostNetValue = has.costNetValue
        resSellTimes = 1
      } else {
        // 次数到达
        if (has.sellTimes !== sellT) {
          sellShares = (has.shares * (1 / (sellT - has.sellTimes)))
          resCostNetValue = has.costNetValue
          resSellTimes++
        }
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
        lastBuyTimes: 0,
        todayIncome: (has.shares * close) - has.positionSum,
        sellTimes: resSellTimes,
        lastSellTimes: sellT,
        flag: sellShares > 0 ? '减仓' : ''
      }
    },
    pMoney(val) {
      return parseInt(parseFloat(val || 0) || 0)
    },
    checkF(list, index, fList) {
      let c = true
      const len = fList.length
      fList.forEach((f, i) => {
        const l = list[index - (len - i)]
        if (f) {
          if (l < 0) {
            c = false
          }
        } else {
          if (l > 0) {
            c = false
          }
        }
      })
      return c
    },
    initPage() {
      this.$http.get('stock/getBIBTKlines', {
        name: 'DOGE',
        interval: '1h'
      }).then((res) => {
        const list = []
        const closeList = []
        res.data.forEach((item) => {
          item.netChangeRatio = this.$countDifferenceRate(item.close, item.open)
          list.push(item)
          closeList.push(item.close)
        })
        this.macdList = macd.macd_data(list)
        const newMacdList = []
        this.macdList.forEach((v) => {
          newMacdList.push(Math.abs(v))
        })
        newMacdList.sort((a, b) => {
          return b - a
        })
        this.maxLine = newMacdList[9]
        console.log('newMacdList', newMacdList)
        console.log('dddd', macd.getMacdDownDiff(this.macdList, list))
        // list = list.slice(0, 300)
        list.reverse()
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
      const list5to = this.$getAverageListTO(recentNetValue, 5)
      const list10to = this.$getAverageListTO(recentNetValue, 10)
      const list20to = this.$getAverageListTO(recentNetValue, 20)

      const xData = []
      const yData = []
      const points = []
      // 最近的在前面
      const netChangeRatioAll = []
      const openList = []
      recentNetValue.forEach((item, index) => {
        xData.unshift(moment(item['tradeDate']).format('YYYY-MM-DD HH:mm:ss'))
        yData.unshift(item['close'])
        openList.unshift(item['open'])
        netChangeRatioAll.unshift(item.netChangeRatio)
      })
      const benjin = 10000
      let has2 = {
        shares: 0,
        costNetValue: 0,
        positionSum: 0,
        hasMoney: benjin,
        buyTimes: 0,
        todayIncome: 0,
        sellTimes: 0,
        flag: '',
        lastSellTimes: 0,
        lastBuyTimes: 0
      }
      const dayInfoList = []
      const kBase = yData[0]
      // const points = []
      const diff5to10List = []
      list5.forEach((v, i) => {
        diff5to10List.push(v - list10[i])
      })
      const macdInfoList = []
      let upOpen = 0
      const upDiffList = []
      let downOpen = 0
      const downDiffList = []
      yData.forEach((item, index) => {
        const netChangeRatio = netChangeRatioAll[index]
        const date = xData[index]
        const close5 = list5[index]
        const close10 = list10[index]
        const close20 = list20[index]
        const open5 = list5to[index]
        const open10 = list10to[index]
        const open20 = list20to[index]
        const rate5 = this.$countDifferenceRate(item, close5)
        const rate10 = this.$countDifferenceRate(item, close10)
        const rateM20 = this.$countDifferenceRate(item, close20)
        const open = openList[index]
        const macdVal = this.macdList[index]
        const macdValLast = this.macdList[index - 1]
        const diff5to10Val = diff5to10List[index]
        const diff5to10ValLast = diff5to10List[index - 1]
        if (Math.abs(macdVal) > this.maxLine) {
          points.push(this.createPoint(date, item, macdVal > 0 ? 'green' : 'red'))
        }

        if (index > 2) {
          if (macdVal > 0 && macdValLast < 0) {
            upOpen = open
          }
          if (macdVal < 0 && macdValLast > 0) {
            if (upOpen) {
              upDiffList.push(this.$countDifferenceRate(item, upOpen))
              upOpen = 0
            }
          }
        }

        if (index > 2) {
          if (macdVal < 0 && macdValLast > 0) {
            downOpen = open
          }
          if (macdVal > 0 && macdValLast < 0) {
            if (downOpen) {
              downDiffList.push(this.$countDifferenceRate(item, downOpen))
              downOpen = 0
            }
          }
        }

        let ismacdValToUp = false
        let ismacdValToDown = false
        let buyTwo = false
        let sellTwo = false
        if (index > 4) {
          if (macdVal > 0) {
            if (macdValLast > 0) {
              buyTwo = true
              ismacdValToUp = this.checkF(this.macdList, index, [false, false, true])
            } else {
              ismacdValToUp = this.checkF(this.macdList, index, [false, false])
            }
          } else {
            if (macdValLast < 0) {
              sellTwo = true
              ismacdValToDown = this.checkF(this.macdList, index, [true, true, false])
            } else {
              ismacdValToDown = this.checkF(this.macdList, index, [true, true])
            }
          }
        }

        let isDiff5to10ValToUp = false
        let isDiff5to10ValToDown = false
        if (index > 4) {
          if (diff5to10Val > 0) {
            if (diff5to10ValLast > 0) {
              buyTwo = true
              isDiff5to10ValToUp = this.checkF(diff5to10List, index, [false, false, true])
            } else {
              isDiff5to10ValToUp = this.checkF(diff5to10List, index, [false, false])
            }
          } else {
            if (diff5to10ValLast < 0) {
              sellTwo = true
              isDiff5to10ValToDown = this.checkF(diff5to10List, index, [true, true, false])
            } else {
              isDiff5to10ValToDown = this.checkF(diff5to10List, index, [true, true])
            }
          }
        }
        macdInfoList.push({
          ismacdValToUp,
          ismacdValToDown,
          isDiff5to10ValToUp,
          isDiff5to10ValToDown,
          date
        })
        // let isDone = ''
        // if (open5 > open10) {
        //   // 买入
        //   // 下降时，好像都是open好
        //   if (open5 > open20) {
        //     has2 = this.countBuy2(has2, open, 1)
        //     isDone = 'buy'
        //   }
        //   // has2 = this.countBuy2(has2, open, 1)
        // } else {
        //   // has2 = this.countSell2(has2, item, 2)
        //   // 都是close好
        //   // 卖出只能用收盘价
        //   if (open5 > open20) {
        //   } else {
        //     has2 = this.countSell2(has2, open, 1)
        //     isDone = 'sell'
        //   }
        // }
        // if (close5 > close10) {
        //   // 买入
        //   // 下降时，好像都是open好
        //   if (isDone !== 'buy') {
        //     if (close5 > close20) {
        //       has2 = this.countBuy2(has2, item, 1)
        //     } else {
        //       has2 = this.countBuy2(has2, item, 2)
        //     }
        //   }
        //   // has2 = this.countBuy2(has2, open, 1)
        // } else {
        //   // has2 = this.countSell2(has2, item, 2)
        //   // 都是close好
        //   // 卖出只能用收盘价
        //   if (isDone !== 'sell') {
        //     if (close5 > close20) {
        //       has2 = this.countSell2(has2, item, 2)
        //     } else {
        //       has2 = this.countSell2(has2, item, 1)
        //     }
        //   }
        // }
        // // TODO 最好的
        // if (close5 > close20) {
        //   // 买入
        //   // 下降时，好像都是open好
        //   if (close5 > close20) {
        //     has2 = this.countBuy2(has2, item, 1)
        //   } else {
        //     has2 = this.countBuy2(has2, item, 2)
        //   }
        //   // has2 = this.countBuy2(has2, open, 1)
        // } else {
        //   // has2 = this.countSell2(has2, item, 2)
        //   // 都是close好
        //   // 卖出只能用收盘价
        //   if (close5 > close20) {
        //     has2 = this.countSell2(has2, item, 2)
        //   } else {
        //     has2 = this.countSell2(has2, item, 1)
        //   }
        // }
        // TODO 牺牲了收益但是回测控制更好
        let done = false
        if (ismacdValToUp || isDiff5to10ValToUp) {
          const price = buyTwo ? open : item
          // const price = item
          if (close5 > close20) {
            has2 = this.countBuy2(has2, price, 1)
          } else {
            has2 = this.countBuy2(has2, price, 2)
          }
          done = true
          // 买入
        }
        if (ismacdValToDown || isDiff5to10ValToDown) {
          const price = sellTwo ? open : item
          // const price = item
          if (close5 > close20) {
            has2 = this.countSell2(has2, price, 2)
          } else {
            has2 = this.countSell2(has2, price, 1)
          }
          done = true
        }
        if (!done) {
          has2.flag = ''
        }
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

      console.log(points)

      upDiffList.sort((a, b) => {
        return a - b
      })
      downDiffList.sort((a, b) => {
        return a - b
      })
      console.log('upDiffList', upDiffList)
      console.log('downDiffList', downDiffList)
      console.log(macdInfoList)
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
          // points.push(this.createPoint(v['日期'], r, 'green'))
        }
        if (v.flag === '加仓') {
          // points.push(this.createPoint(v['日期'], r, 'red'))
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
            data: yData,
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
          }
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
