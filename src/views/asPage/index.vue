<template>
  <div class="app-container">
    <div class="r-w">
      <el-radio-group v-model="indexKey" size="mini">
        <el-radio-button
          v-for="(item, index) in indexList"
          :key="index"
          :label="item.key"
        >{{ item.name }}</el-radio-button>
      </el-radio-group>
    </div>
    <div :id="id" :style="{height:'600px',width: '100%'}"/>
  </div>
</template>

<script>
import indexList from '@/common/indexList'
import arrayUtil from '@/utils/arrayUtil'
import stockAnalysisUtil from '@/utils/stockAnalysisUtil'
import flagUtil from '@/utils/flagUtil'
import numberUtil from '@/utils/numberUtil'
import echarts from 'echarts'

export default {
  name: 'MonthLineAll',
  data() {
    return {
      indexKey: 'wulin',
      indexList,
      dataList: [],
      chart: null,
      indexItem: null,
      id: 'MonthLineAll'
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
    createPoint(date, value, color, label) {
      let labeConfig = {
        show: false
      }
      if (label) {
        labeConfig = {
          show: true,
          formatter: label,
          position: 'top'
        }
      }
      return {
        coord: [date, value],
        itemStyle: {
          normal: {
            color: color
          }
        },
        label: labeConfig
      }
    },
    counRateAver(recentNetValue) {
      const xData = []
      for (let j = 0; j < 7; j = j + 0.1) {
        xData.push({
          number: j.toFixed(1),
          count: 0,
          countList: [],
          count2: 0,
          countList2: []
        })
      }
      let sum = 0
      const list = []
      const wList = []
      recentNetValue.forEach((item) => {
        // if (item.netChangeRatio > 0) {
        //   return false
        // }
        sum += Math.abs(item.netChangeRatio)
        const value = Math.abs(item.netChangeRatio)
        list.push(value)
        const cc = numberUtil.countDifferenceRate(item.high, item.low)
        wList.push(Math.abs(cc))
        for (let i = 0; i < xData.length; i++) {
          if (value >= xData[i].number && xData[i + 1] && value < xData[i + 1].number) {
            xData[i].count++
            xData[i].countList.push(value)
            break
          }
        }
      })
      xData.sort((a, b) => {
        return b.count - a.count
      })
      list.sort((a, b) => {
        return a - b
      })
      wList.sort((a, b) => {
        return a - b
      })
      const list2 = list.slice(
        parseInt(list.length * 0.17),
        parseInt(list.length * 0.83)
      )
      const wList2 = wList.slice(
        parseInt(wList.length * 0.17),
        parseInt(wList.length * 0.83)
      )
      let sum3 = 0
      let count3 = 0
      xData.forEach((item, i) => {
        if (i >= 4 && i <= 16) {
          item.countList.forEach((nItem) => {
            sum3 += nItem
            count3++
          })
        }
      })
      let sum4 = 0
      list2.forEach((item, i) => {
        sum4 += item
      })
      let sum5 = 0
      wList2.forEach((item, i) => {
        sum5 += item
      })
      console.log(xData)
      console.log(sum / recentNetValue.length)
      console.log(sum3 / count3)
      console.log(list2.length)
      console.log(sum4 / list2.length)
      console.log(wList2.length)
      console.log((sum5 / 2) / wList2.length)
      console.log(`rate:${sum4 / list2.length},wave:${(sum5 / 2) / wList2.length},`)
    },
    initPage() {
      const indexItem = arrayUtil.findItem(indexList, 'key', this.indexKey)
      this.indexItem = indexItem
      if (!indexItem) {
        return
      }
      this.indexItem = indexItem
      this.$http.get('/mock/stockKline', {
        key: indexItem.key
      }).then((res) => {
        const list = []
        res.data.newList.forEach((item) => {
          list.unshift({
            date: item.tradeTime,
            ...item
          })
        })
        this.dataList = list
        this.initChart()
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const indexRate = this.indexItem.rate
      const recentNetValue = this.dataList
      // 均线
      this.counRateAver(recentNetValue)
      const m5List = this.$getAverageList(recentNetValue, 5)
      const m10List = this.$getAverageList(recentNetValue, 10)
      const monthList = this.$getAverageList(recentNetValue, 20)
      const m25List = this.$getAverageList(recentNetValue, 25)
      const m30List = this.$getAverageList(recentNetValue, 30)
      const m40List = this.$getAverageList(recentNetValue, 40)
      const m50List = this.$getAverageList(recentNetValue, 50)
      const quarterList = this.$getAverageList(recentNetValue, 60)
      const halfYearList = this.$getAverageList(recentNetValue, 120)
      const yearList = this.$getAverageList(recentNetValue, 250)
      const xData = []
      const yData = []
      const points = []
      // 最近的在前面
      const netChangeRatioAll = []
      recentNetValue.forEach((item, index) => {
        xData.unshift(item['date'])
        yData.unshift(item['close'] || 0)
        netChangeRatioAll.push(item.netChangeRatio)
      })
      // 线差值
      const yData4 = []
      const diffList = []
      this.counRateAver(recentNetValue)
      const mqDiffList = []
      const mqDiffListRaw = []
      monthList.forEach((item, index) => {
        const rate = this.$countDifferenceRate(item, quarterList[index])
        mqDiffList.push(rate + 15)
        mqDiffListRaw.push(rate)
      })
      // console.log(mqDiffList)
      // console.log(mqDiffListRaw)
      const mqAver = this.$getAverageDiffList(mqDiffList, 10)
      // console.log(mqAver)
      const mqList = []
      const tqDiffList = []
      yData.forEach((item, index) => {
        const rateQ = this.$countDifferenceRate(item, quarterList[index])
        tqDiffList.push(rateQ + 30)
      })
      const qAVList = this.$getAverageDiffList(tqDiffList, 20)
      const tqDiffList2 = []
      yData.forEach((item, index) => {
        const rateQ = this.$countDifferenceRate(item, quarterList[index])
        tqDiffList2.push(rateQ + 30)
      })
      const qAVList2 = this.$getAverageDiffList(tqDiffList2, 30)
      const aa = []
      yData.forEach((item, index) => {
        const rateMA = this.$countDifferenceRate(tqDiffList[index], qAVList[index])
        aa.push(rateMA)
      })
      // console.log('aa', aa)
      const monthUpDays = []
      let count = 0
      yData.forEach((item, index) => {
        const rateQ = this.$countDifferenceRate(item, monthList[index])
        if (rateQ > 0) {
          count++
        } else {
          count = 0
        }
        monthUpDays.push(count)
      })
      yData.forEach((item, index) => {
        const rateT = this.$countDifferenceRate(item, m5List[index])
        const rateM10 = this.$countDifferenceRate(item, m10List[index])
        const rateM = this.$countDifferenceRate(item, monthList[index])
        const rateM25 = this.$countDifferenceRate(item, m25List[index])
        const rateM30 = this.$countDifferenceRate(item, m30List[index])
        const rateM40 = this.$countDifferenceRate(item, m40List[index])
        const rateM50 = this.$countDifferenceRate(item, m50List[index])
        const rateQ = this.$countDifferenceRate(item, quarterList[index])
        const rateY = this.$countDifferenceRate(item, yearList[index])
        const rateH = this.$countDifferenceRate(item, halfYearList[index])
        const rateMQ = this.$countDifferenceRate(mqDiffList[index], mqAver[index])
        const rateMA = this.$countDifferenceRate(tqDiffList[index], qAVList[index])
        const rateMA2 = this.$countDifferenceRate(tqDiffList2[index], qAVList2[index])
        mqList.push(rateMQ)
        const day = 5
        const averageList = []
        if (index >= day) {
          for (let i = day; i >= 0; i--) {
            const nowIndex = index - i
            averageList.push(this.$countDifferenceRate(yData[nowIndex], monthList[nowIndex]))
          }
        }
        let noSell = stockAnalysisUtil.ifNoSell(averageList)
        const rate = this.$countDifferenceRate(item, monthList[index])
        // 移动均线策略
        let diff = 0
        if (index > 10) {
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
          diff = this.$countDifferenceRate(now / 7, last / 7)
          if (diff < 0.2) {
            c = false
          }
          if (!c) {
            noSell = false
          }
        }
        const quarterYearDiff = this.$countDifferenceRate(quarterList[index], yearList[index])
        let isBad = false
        if (rateY > 0) {
          isBad = quarterYearDiff < 0
        } else {
          isBad = quarterYearDiff < 2
        }
        // if (monthHalfYearDiff > 0) {
        //   isBad = false
        // } else {
        //   isBad = false
        // }
        const monthHalfYearDiff = this.$countDifferenceRate(monthList[index], halfYearList[index])
        const monthQuarterDiff = this.$countDifferenceRate(monthList[index], quarterList[index])
        const quarterHalfYearDiff = this.$countDifferenceRate(quarterList[index], halfYearList[index])
        const halfYeaYearDiff = this.$countDifferenceRate(halfYearList[index], yearList[index])
        diffList.push({
          rateT,
          rateM,
          rateQ,
          rateY,
          rateH,
          noSell,
          rateMQ,
          rateMA,
          rateMA2,
          rateM25,
          rateM30,
          rateM10,
          rateM40,
          rateM50,
          monthClose: monthList[index],
          quarterClose: quarterList[index],
          yearClose: yearList[index],
          halfYearClose: halfYearList[index],
          quarterYearDiff,
          monthHalfYearDiff,
          monthQuarterDiff,
          halfYeaYearDiff,
          quarterHalfYearDiff,
          isBad,
          isTD3: m5List[index] > m30List[index],
          monUpDays: monthUpDays[index],
          date: xData[index]
        })
        const upColor = 'rgba(208, 153, 183, 0.5)'
        const downColor = 'rgba(112, 220, 240, 0.5)'
        let color = ''
        if (rateM > 0) {
          color = upColor
          // if (rateMA2 < 0) {
          //   color = 'green'
          // }
        } else {
          color = downColor
          // if (rateMA2 > 0) {
          //   color = 'red'
          // }
        }
        yData4.push({
          value: rateM,
          itemStyle: {
            color: color
          }
        })
      })
      // console.log(mqList)
      const allLength = netChangeRatioAll.length
      let qH = false
      let isFix = false
      const isOneDeep = false
      const qHList = []
      const isFixList = []
      const isOneDeepList = []
      let noSellFlag = false
      const noSellLine = []
      let noSellChangeIndex = 0
      let monthUpDay = 1
      let monthDownDay = 1
      // this.$http.post('/mock/upStockKlineAy', diffList.slice(0, 1000))
      diffList.forEach((diffInfo, index) => {
        if (diffInfo.rateQ < 0) {
          qH = false
        }
        if (diffInfo.rateQ > this.indexItem.quarterHotLine) {
          qH = true
        }
        qHList.push(qH)
        if (diffInfo.rateH > this.indexItem.relieveFixLine) {
          isFix = false
        }
        if (diffInfo.rateH < this.indexItem.fixLine) {
          isFix = true
        }
        isFixList.push(isFix)
        if (diffInfo.rateM > 0) {
          diffInfo.monthUpDay = monthUpDay
          monthUpDay++
          monthDownDay = 1
        } else {
          diffInfo.monthDownDay = monthDownDay
          monthDownDay++
          monthUpDay = 1
        }
        if (diffInfo.noSell) {
          if (noSellFlag === false) {
            noSellFlag = true
            noSellLine.push({
              gte: noSellChangeIndex,
              lte: index,
              color: 'rgb(160,160,160)'
            })
            noSellChangeIndex = index
          }
        } else {
          if (noSellFlag === true) {
            noSellFlag = false
            noSellLine.push({
              gte: noSellChangeIndex,
              lt: index,
              color: 'rgba(255,0,0, 0.6)'
            })
            noSellChangeIndex = index
          }
        }
      })
      // 画点
      netChangeRatioAll.forEach((item, index) => {
        // 最后几个不要
        if (allLength - 10 <= index) {
          return false
        }
        const show = true
        const nowKline = recentNetValue[index]
        const diffInfo = diffList[(diffList.length - 1) - index]
        const netChangeRatioList = this.$getNetChangeRatioList(netChangeRatioAll, index)
        const recentValueList = this.$getNetChangeRatioList(recentNetValue, index)
        const threeDay = stockAnalysisUtil.countDown(netChangeRatioList, 3, 3)
        const date = nowKline['date']
        const cValue = nowKline['close']
        const upValue = nowKline['close'] + (nowKline['close'] / 40)
        const upValueBig = nowKline['close'] + (nowKline['close'] / 20)
        const downValue = nowKline['close'] - (nowKline['close'] / 100)
        const qH = qHList[(diffList.length - 1) - index]
        const isFix = isFixList[(diffList.length - 1) - index]
        function ifDown(day) {
          return stockAnalysisUtil.countDown(netChangeRatioList, day, day)
        }
        function ifUp(day) {
          return stockAnalysisUtil.countUp(netChangeRatioList, day, day)
        }
        const cdate = nowKline.date
        // if (index < netChangeRatioAll.length - 40) {
        //   const end = index + 30
        //   const m5l = m5List.slice(index, end)
        //   const m10l = m10List.slice(index, end)
        //   const m20l = monthList.slice(index, end)
        //   // if (index === 10) {
        //   //   console.log(m5l)
        //   //   console.log(m10l)
        //   //   console.log(m20l)
        //   // }
        //   const tbFlag = stockAnalysisUtil.tangleLine(
        //     m5l,
        //     m10l,
        //     m20l,
        //     { days: 3, rate: 0.66 }
        //   )
        //   if (tbFlag) {
        //     // console.log(m5l)
        //     // console.log(m10l)
        //     // console.log(m20l)
        //     points.push(this.createPoint(date, cValue, '#000'))
        //   }
        //   if (date === '2020-11-20') {
        //     console.log(m5l)
        //     console.log(m10l)
        //     console.log(m20l)
        //   }
        // }
        // if (netChangeRatioList[0] > (6)) {
        //   points.push(this.createPoint(date, cValue, 'red'))
        //   if (netChangeRatioList[0] > (7)) {
        //     points.push(this.createPoint(date, cValue, '#000'))
        //   }
        // }
        // if (diffInfo.rateM > 10) {
        //   if (diffInfo.rateM > 15) {
        //     points.push(this.createPoint(date, cValue, '#000'))
        //   } else {
        //     points.push(this.createPoint(date, cValue, 'red'))
        //   }
        // }
        if (diffInfo.rateMA < 0 && diffInfo.rateM > 0) {
          if (netChangeRatioList[0] < 0) {
            // if (diffInfo.rateM10 > 0) {
            //   points.push(this.createPoint(date, cValue, 'red'))
            // } else {
            //   points.push(this.createPoint(date, cValue, '#000'))
            // }
            // if (diffInfo.rateM > 0) {
            //   points.push(this.createPoint(date, cValue, '#000'))
            // }
          }
          // points.push(this.createPoint(date, cValue, '#000'))

          // if (diffInfo.isBad) {
          //   points.push(this.createPoint(date, cValue, '#000'))
          // }
        }
        // if (diffInfo.rateMA < 0 && diffInfo.rateMA2 > 0) {
        //   points.push(this.createPoint(date, cValue, 'red'))
        // }
        // const info1 = stockAnalysisUtil.countDown(netChangeRatioList, 9, 8)
        // if (info1.flag) {
        //   if (info1.rate < -(5 * indexRate)) {
        //
        //   }
        //   points.push(this.createPoint(date, cValue, '#000'))
        // }
        if (diffInfo.noSell) {
          if (netChangeRatioList[0] < 0) {
          }
          // 小策略都可以在不锁仓的情况下进行，锁仓的已经研究透了
          // TODO 卖出测试入口
        } else {
          // TODO
          // 买入测试入口
          if (!(diffInfo.isBad && !isFix && diffInfo.rateM < 0) && !qH) {
            // 到了月下就只有大反了
            if (diffInfo.rateM > 0) {
            }
          }
        }
      })
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
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: [
          {
            type: 'value',
            name: '点数',
            scale: true,
            splitLine: {
              show: false
            }
          },
          {
            type: 'value',
            name: '差值',
            splitLine: {
              show: false
            }
          }
        ],
        dataZoom: [
          {
            show: true,
            start: 90,
            end: 100
          },
          {
            type: 'inside',
            start: 90,
            end: 100
          }
        ],
        visualMap: {
          show: false,
          dimension: 0,
          seriesIndex: 0,
          pieces: noSellLine
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
            name: '月线',
            data: monthList,
            type: 'line',
            lineStyle: {
              color: 'rgba(132, 7, 189, 0.5)'
            },
            smooth: false,
            symbol: 'none'
          },
          {
            name: '季度线',
            data: m5List,
            type: 'line',
            lineStyle: {
              color: 'rgba(170,136,0,0.5)'
            },
            smooth: false,
            symbol: 'none'
          },
          {
            name: '季度线',
            data: m10List,
            type: 'line',
            lineStyle: {
              color: 'rgba(240,50,120,0.5)'
            },
            smooth: false,
            symbol: 'none'
          },
          // {
          //   name: '季度线',
          //   data: quarterList,
          //   type: 'line',
          //   lineStyle: {
          //     color: 'rgba(170,136,0,0.5)'
          //   },
          //   smooth: false,
          //   symbol: 'none'
          // },
          {
            name: '差值',
            data: yData4,
            yAxisIndex: 1,
            type: 'bar',
            markLine: {
              silent: true,
              data: [
                {
                  yAxis: this.indexItem.reduceLine,
                  lineStyle: {
                    color: '#F56C6C'
                  }
                }, {
                  yAxis: this.indexItem.relieveZ45Line || 0,
                  lineStyle: {
                    color: '#F56C6C'
                  }
                },
                {
                  yAxis: yData4[yData4.length - 1].value,
                  lineStyle: {
                    color: 'rgb(155,110,255)'
                  }
                }
              ]
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
