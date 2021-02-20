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
    initPage() {
      this.$http.get('stock/getBtbKlines').then((res) => {
        let list = []
        res.data.forEach((item) => {
          item.netChangeRatio = this.$countDifferenceRate(item.close, item.open)
          list.push(item)
        })
        list = list.slice(0, 200)
        list.reverse()
        this.dataList = list
        this.initChart()
      })
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
      if (sellTime === 1) {
        return {
          has: {
            shares: shares * (2 / 3),
            cost: cost,
            sum: sum * (2 / 3)
          },
          income: (close - cost) * shares * (1 / 3)
        }
      } else if (sellTime === 2) {
        return {
          has: {
            shares: shares * (1 / 2),
            cost: cost,
            sum: sum * (1 / 2)
          },
          income: (close - cost) * shares * (1 / 2)
        }
      } else if (sellTime === 3) {
        return {
          has: {
            shares: 0,
            cost: 0,
            sum: 0
          },
          income: (close - cost) * shares
        }
      }
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
      recentNetValue.forEach((item, index) => {
        xData.unshift(moment(item['tradeDate']).format('YYYY-MM-DD'))
        yData.unshift(item['close'])
        netChangeRatioAll.unshift(item.netChangeRatio)
      })
      const buyMoney = 500
      const has = {
        shares: 0,
        cost: 0,
        sum: 0
      }
      const sellTime = 0
      const income = 0
      const maxSum = 0
      const hasIncome = 0

      let has2 = {
        shares: 0,
        cost: 0,
        sum: 0
      }
      let sellTime2 = 0
      let income2 = 0
      let maxSum2 = 0
      let hasIncome2 = 0
      let maxLoss2 = 0
      const hasList = []
      yData.forEach((item, index) => {
        const netChangeRatio = netChangeRatioAll[index]
        const date = xData[index]
        const close5 = list5[index]
        const close10 = list10[index]
        const close20 = list20[index]
        const rate5 = this.$countDifferenceRate(item, close5)
        const rate10 = this.$countDifferenceRate(item, close10)
        const rateM20 = this.$countDifferenceRate(item, close20)
        // if (close5 > close10) {
        //   sellTime = 0
        //   has = this.countBuy(has, buyMoney, item)
        // } else {
        //   sellTime++
        //   if (sellTime <= 3) {
        //     has = this.countSell(has, sellTime, item)
        //     income += has.income
        //     has.income = 0
        //   } else {
        //     sellTime = 0
        //   }
        // }
        // if (has.sum > maxSum) {
        //   maxSum = has.sum
        // }
        // if (index === (yData.length - 1)) {
        //   hasIncome = (item - has.cost) * has.shares
        // }
        let localIncome = 0
        // 策越2
        if (close5 > close10) {
          if (close10 < close20) {
            if (netChangeRatio < 0) {
              sellTime2 = 0
              has2 = this.countBuy(has2, buyMoney, item)
            }
          } else {
            sellTime2 = 0
            has2 = this.countBuy(has2, buyMoney, item)
          }
        } else {
          if (close10 > close20) {
            if (netChangeRatio > 0) {
              sellTime2++
              if (sellTime2 <= 3) {
                const ss = this.countSell(has2, sellTime2, item)
                has2 = ss.has
                income2 += ss.income
                localIncome = ss.income
              } else {
                sellTime2 = 0
              }
            }
          } else {
            sellTime2++
            if (sellTime2 <= 3) {
              const ss = this.countSell(has2, sellTime2, item)
              has2 = ss.has
              income2 += ss.income
              localIncome = ss.income
            } else {
              sellTime2 = 0
            }
          }
        }
        if (has2.sum > maxSum2) {
          maxSum2 = has2.sum
        }
        if (index === (yData.length - 1)) {
          hasIncome2 = (item - has2.cost) * has2.shares
        }
        if (maxLoss2 > localIncome) {
          maxLoss2 = localIncome
        }
        hasList.push({
          ...has2,
          income: localIncome,
          date
        })
      })
      // console.log('最大仓位', maxSum)
      // console.log('持有收益', hasIncome)
      // console.log('了结收益', income)
      // console.log('总收益', income + hasIncome)
      console.log('最大仓位2', maxSum2)
      console.log('持有收益2', hasIncome2)
      console.log('了结收益2', income2)
      console.log('总收益2', income2 + hasIncome2)
      console.log('最大单笔亏损', maxLoss2)

      console.log(hasList)
      this.chart.setOption({
        title: {
          text: 'K线变化',
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
        dataZoom: [
          {
            show: true,
            start: 70,
            end: 100
          },
          {
            type: 'inside',
            start: 70,
            end: 100
          }
        ],
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
            name: 'K线',
            data: yData,
            type: 'line',
            lineStyle: {
              color: '#409EFF'
            },
            smooth: false,
            symbol: 'none',
            markPoint: {
              data: points,
              symbol: 'circle',
              symbolSize: 4
            },
            markLine: {
              silent: true,
              data: [{
                yAxis: recentNetValue[0].close,
                lineStyle: {
                  color: '#aaa'
                }
              }]
            }
          },
          {
            name: '5日线',
            data: list5,
            type: 'line',
            lineStyle: {
              color: '#606266'
            },
            smooth: false,
            symbol: 'none'
          },
          {
            name: '10日线',
            data: list10,
            type: 'line',
            lineStyle: {
              color: '#909399'
            },
            smooth: false,
            symbol: 'none'
          },
          {
            name: '20日线',
            data: list20,
            type: 'line',
            lineStyle: {
              color: '#C0C4CC'
            },
            smooth: false,
            symbol: 'none'
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
