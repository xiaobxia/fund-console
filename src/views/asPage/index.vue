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
import echarts from 'echarts'

export default {
  name: 'MonthLineAll',
  data() {
    return {
      indexKey: 'chuangye',
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
      const indexItem = arrayUtil.findItem(indexList, 'key', this.indexKey)
      this.indexItem = indexItem
      if (!indexItem) {
        return
      }
      this.indexItem = indexItem
      this.$http.get('stock/getStockAllDongfang', {
        code: indexItem.code,
        days: indexItem.days
      }).then((res) => {
        const list = []
        res.data.list.forEach((item) => {
          list.push({
            date: item.date,
            ...item.kline
          })
        })
        this.dataList = list
        this.initChart()
      })
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
      let list = []
      recentNetValue.forEach((item) => {
        // if (item.netChangeRatio > 0) {
        //   return false
        // }
        sum += Math.abs(item.netChangeRatio)
        list.push(Math.abs(item.netChangeRatio))
        const value = Math.abs(item.netChangeRatio)
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
      let sum3 = 0
      let count3 = 0
      xData.forEach((item) => {
        const n = parseFloat(item.number)
        if (n >= 0.6 && n <= 1.2) {
          item.countList.forEach((nItem) => {
            sum3 += nItem
            count3++
          })
        }
      })
      console.log(xData)
      list.sort((a, b) => {
        return a - b
      })
      list = list.slice(30)
      list = list.slice(0, list.length - 30)
      let sum2 = 0
      let count2 = 0
      list.forEach((item) => {
        count2++
        sum2 += item
      })
      console.log(sum / recentNetValue.length)
      console.log(sum2 / count2)
      console.log(sum3 / count3)
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const indexRate = this.indexItem.rate
      const recentNetValue = this.dataList
      // 均线
      // this.counRateAver(recentNetValue)
      const monthList = this.$getAverageList(recentNetValue, 40)
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
        yData.unshift(item['close'])
        netChangeRatioAll.push(item.netChangeRatio)
      })
      // 线差值
      const yData4 = []
      const diffList = []
      yData.forEach((item, index) => {
        const rateM = this.$countDifferenceRate(item, monthList[index])
        const rateQ = this.$countDifferenceRate(item, quarterList[index])
        const rateY = this.$countDifferenceRate(item, yearList[index])
        const rateH = this.$countDifferenceRate(item, halfYearList[index])
        const day = 5
        const averageList = []
        if (index >= day) {
          for (let i = day; i >= 0; i--) {
            const nowIndex = index - i
            averageList.push(this.$countDifferenceRate(yData[nowIndex], monthList[nowIndex]))
          }
        }
        const noSell = stockAnalysisUtil.ifNoSell(averageList)
        const rate = this.$countDifferenceRate(item, monthList[index])
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
        const diff = this.$countDifferenceRate(now / 7, last / 7)
        if (diff < 0.2) {
          c = false
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
        const monthHalfYearDiff = this.$countDifferenceRate(monthList[index], quarterList[index])
        diffList.push({
          rateM,
          rateQ,
          rateY,
          rateH,
          noSell,
          monthClose: monthList[index],
          quarterClose: quarterList[index],
          yearClose: yearList[index],
          halfYearClose: halfYearList[index],
          quarterYearDiff,
          monthHalfYearDiff,
          isBad
        })
        yData4.push({
          value: rateM,
          itemStyle: {
            color: rateM > 0 ? 'rgba(208, 153, 183)' : 'rgba(112, 220, 240)'
          }
        })
      })
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
        // if (cdate[4] === '1' && cdate[5] === '1') {
        //
        //   points.push(this.createPoint(date, downValue, '#000'))
        // }
        // if (stockAnalysisUtil.countLowDown(netChangeRatioList).flag) {
        //   points.push(this.createPoint(date, downValue, '#000'))
        // }
        if (netChangeRatioList[0] > 0 && netChangeRatioList[0] < 0.3) {
          if (netChangeRatioList[1] < 0 && netChangeRatioList[2] < 0) {
            if ((netChangeRatioList[1] + netChangeRatioList[2]) < -(3 * indexRate)) {
              points.push(this.createPoint(date, downValue, '#000'))
            }
          }
        }
        if (diffInfo.rateM > 0) {
          // if (stockAnalysisUtil.countDown(netChangeRatioList, 4, 4).flag) {
          //   points.push(this.createPoint(date, downValue, '#000'))
          // }
        }
        // const info = stockAnalysisUtil.countDown(netChangeRatioList, 3, 3)
        // if (qH && diffInfo.rateM < 0) {
        //
        // } else {
        //   if (!stockAnalysisUtil.countDown(netChangeRatioList, 4, 4).flag) {
        //     if (info.flag) {
        //       if (diffInfo.rateM > 0) {
        //         points.push(this.createPoint(date, downValue, '#000'))
        //       } else {
        //         points.push(this.createPoint(date, downValue, '#ff0000'))
        //       }
        //     }
        //   }
        // }
        // if (diffInfo.rateM > 0) {
        //   const info = stockAnalysisUtil.countDown(netChangeRatioList, 3, 3)
        //   if (info.flag) {
        //     points.push(this.createPoint(date, downValue, 'red'))
        //   }
        // }
        if (diffInfo.noSell) {
          // 小策略都可以在不锁仓的情况下进行，锁仓的已经研究透了
          // TODO 卖出测试入口
          // points.push(this.createPoint(date, downValue, 'blue'))
        } else {
          // TODO
          // 买入测试入口
          if (!(diffInfo.isBad && !isFix && diffInfo.rateM < 0) && !qH) {
            // if (diffInfo.rateM < 0) {
            //   const info1 = stockAnalysisUtil.countDown(netChangeRatioList, 3, 3)
            //   if (info1.flag) {
            //     points.push(this.createPoint(date, downValue, 'red'))
            //   }
            // }
            // if (netChangeRatioList[0] < -(4 * indexRate)) {
            //   points.push(this.createPoint(date, downValue, 'red'))
            // }
            // 到了月下就只有大反了
            if (diffInfo.rateM > 0) {
              // const info = stockAnalysisUtil.countRule(netChangeRatioList, [false, true, false])
              // if (info.flag) {
              //   points.push(this.createPoint(date, downValue, 'red'))
              //   if (info.rate < -(indexRate * 2)) {
              //     points.push(this.createPoint(date, downValue, '#000'))
              //     // points.push(this.createPoint(date, downValue, '#000'))
              //   }
              //   // if (info.rate < -(indexRate * 5)) {
              //   //   // points.push(this.createPoint(date, downValue, 'red'))
              //   //   points.push(this.createPoint(date, downValue, '#000'))
              //   // }
              // }
              // const info = stockAnalysisUtil.countDown(netChangeRatioList, 4, 3)
              // if (info.flag) {
              //   points.push(this.createPoint(date, downValue, 'red'))
              //   // if (info.rate < -(indexRate * 2)) {
              //   //   points.push(this.createPoint(date, downValue, '#000'))
              //   //   // points.push(this.createPoint(date, downValue, '#000'))
              //   // }
              //   if (info.rate < -(indexRate * 3)) {
              //     // points.push(this.createPoint(date, downValue, 'red'))
              //     points.push(this.createPoint(date, downValue, '#000'))
              //   }
              // }
            }
            // const twoDownInfo = stockAnalysisUtil.countDown(netChangeRatioList, 2, 2)
            // if (twoDownInfo.rate < -(indexRate * 5)) {
            //   return true
            // }
          }
        }
        // if (diffInfo.isBad && !isFix && diffInfo.rateQ < 0) {
        //   points.push(this.createPoint(date, downValue, 'red'))
        //   const twoDownInfo = stockAnalysisUtil.countUp(netChangeRatioList, 3, 3)
        //   if (twoDownInfo.flag) {
        //     points.push(this.createPoint(date, downValue, '#000'))
        //   }
        //   if (diffInfo.rateM > 0) {
        //     if (!diffInfo.noSell && netChangeRatioList[0] > 0) {
        //       points.push(this.createPoint(date, downValue, '#000'))
        //     }
        //   }
        // }
        // if (!diffInfo.isBad) {
        //   if (diffInfo.rateQ < -5) {
        //     points.push(this.createPoint(date, downValue, 'red'))
        //   }
        //   if (diffInfo.rateQ < -7) {
        //     points.push(this.createPoint(date, downValue, '#000'))
        //   }
        // }
        // if (diffInfo.monthDownDay < 3) {
        //   points.push(this.createPoint(date, downValue, '#ff0000'))
        // }
        // if (netChangeRatioList[0] < -(5 * indexRate)) {
        //   if (!qH) {
        //     points.push(this.createPoint(date, downValue, '#ff0000'))
        //   }
        // }
        // if (diffInfo.noSell) {
        //   points.push(this.createPoint(date, downValue, 'yellow'))
        // }
        // const a = stockAnalysisUtil.countUp(netChangeRatioList, 4, 4)
        // if (a.flag) {
        //   points.push(this.createPoint(date, downValue, 'green'))
        // }
        // if (diffInfo.rateM > 0 && diffInfo.rateY < 0 && diffInfo.rateH < this.indexItem.downTrendLine) {
        //   if (!diffInfo.noSell) {
        //     if (netChangeRatioList[0] > -(indexRate)) {
        //       points.push(this.createPoint(date, downValue, 'green'))
        //     }
        //   }
        // }
        // if (!diffInfo.noSell) {
        //   const a = stockAnalysisUtil.countUp(netChangeRatioList, 2, 2)
        //   if (a.flag) {
        //     points.push(this.createPoint(date, downValue, '#ff0000'))
        //     if (a.rate > (4 * indexRate)) {
        //       points.push(this.createPoint(date, downValue, '#000'))
        //     }
        //     // if (diffInfo.rateH < 0) {
        //     //   points.push(this.createPoint(date, downValue, '#000'))
        //     // } else {
        //     //   points.push(this.createPoint(date, downValue, '#ff0000'))
        //     // }
        //     // points.push(this.createPoint(date, downValue, '#ff0000'))
        //   }
        //   // if (a.flag && a.rate > (3 * indexRate)) {
        //   //   points.push(this.createPoint(date, downValue, '#ff0000'))
        //   // }
        //   // if (a.flag && a.rate > (4 * indexRate)) {
        //   //   points.push(this.createPoint(date, downValue, '#000'))
        //   // }
        // }
        // if (qH && diffInfo.rateM < 0) {
        //
        // } else {
        //   if (netChangeRatioList[0] < -(4 * indexRate)) {
        //     points.push(this.createPoint(date, downValue, '#ff0000'))
        //   }
        //   if (netChangeRatioList[0] < -(6 * indexRate)) {
        //     points.push(this.createPoint(date, downValue, '#000'))
        //   }
        // }
        // if (netChangeRatioList[0] < -(6 * indexRate)) {
        //   points.push(this.createPoint(date, downValue, '#000'))
        // }
        // if (netChangeRatioList[0] < -(7 * indexRate)) {
        //   points.push(this.createPoint(date, downValue, '#000'))
        // }
        // if (flagUtil.fixSell(diffInfo, this.indexItem, netChangeRatioList, qH)) {
        //   points.push(this.createPoint(date, downValue, '#ff0000'))
        // }
        // if (diffInfo.rateQ < 0 && diffInfo.rateM < 0 && diffInfo.rateH < 0 && diffInfo.rateY < 0) {
        //   if (netChangeRatioList[0] < 0) {
        //     if (!isFix) {
        //       points.push(this.createPoint(date, downValue, '#ff0000'))
        //     }
        //   }
        // }
        // if (!diffInfo.noSell) {
        //   if (diffInfo.rateM < 0 && diffInfo.rateQ < 0 && diffInfo.rateY < 0 && diffInfo.rateH < 0) {
        //     if (netChangeRatioList[0] < 0) {
        //       points.push(this.createPoint(date, downValue, 'green'))
        //       // if (netChangeRatioList[1] < 0 && netChangeRatioList[2] < 0) {
        //       //   points.push(this.createPoint(date, downValue, '#000'))
        //       // }
        //     }
        //   }
        // }
        // if (threeDay.flag && threeDay.rate < -(3 * indexRate)) {
        //   if (show) {
        //     points.push(this.createPoint(date, downValue, '#ff0000'))
        //   } else {
        //     return false
        //   }
        // }
        // if (stockAnalysisUtil.countDown(netChangeRatioList, 6, 5).flag) {
        //   if (show) {
        //     points.push(this.createPoint(date, downValue, '#ff0000'))
        //   } else {
        //     return false
        //   }
        // }
        // if (stockAnalysisUtil.countDown(netChangeRatioList, 4, 4).flag) {
        //   if (show) {
        //     points.push(this.createPoint(date, downValue, '#ff0000'))
        //   } else {
        //     return false
        //   }
        // }
        // if (stockAnalysisUtil.countDown(netChangeRatioList, 5, 5).flag) {
        //   if (show) {
        //     points.push(this.createPoint(date, downValue, 'black'))
        //   } else {
        //     return false
        //   }
        // }
        // if (stockAnalysisUtil.countDown(netChangeRatioList, 7, 6).flag) {
        //   if (show) {
        //     points.push(this.createPoint(date, downValue, 'black'))
        //   } else {
        //     return false
        //   }
        // }
        // if (stockAnalysisUtil.countDown(netChangeRatioList, 8, 7).flag) {
        //   if (show) {
        //     points.push(this.createPoint(date, downValue, 'black'))
        //   } else {
        //     return false
        //   }
        // }
        // if (stockAnalysisUtil.countDown(netChangeRatioList, 8, 6).flag) {
        //   if (show) {
        //     points.push(this.createPoint(date, downValue, 'black'))
        //   } else {
        //     return false
        //   }
        // }
        // if (stockAnalysisUtil.countDown(netChangeRatioList, 9, 7).flag) {
        //   if (show) {
        //     points.push(this.createPoint(date, downValue, 'black'))
        //   } else {
        //     return false
        //   }
        // }
        // if (stockAnalysisUtil.countLowDown2(netChangeRatioList).flag) {
        //   if (!stockAnalysisUtil.countLowDown(netChangeRatioList).flag) {
        //     if (show) {
        //       points.push(this.createPoint(date, upValue, 'green'))
        //     } else {
        //       return false
        //     }
        //   }
        // }
        // if (stockAnalysisUtil.lowWake(recentValueList, indexRate * 2).flag) {
        //   if (show) {
        //     points.push(this.createPoint(date, upValueBig, 'black'))
        //   } else {
        //     return false
        //   }
        // }
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
        visualMap: {
          show: false,
          dimension: 0,
          seriesIndex: 0,
          pieces: noSellLine
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
        series: [
          {
            name: 'K线',
            data: yData,
            type: 'line',
            // lineStyle: {
            //   color: '#ccc'
            // },
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
            data: yearList,
            type: 'line',
            lineStyle: {
              color: 'rgba(132, 7, 189, 0.5)'
            },
            smooth: false,
            symbol: 'none'
          },
          {
            name: '季度线',
            data: quarterList,
            type: 'line',
            lineStyle: {
              color: 'rgba(170,136,0,0.5)'
            },
            smooth: false,
            symbol: 'none'
          },
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
