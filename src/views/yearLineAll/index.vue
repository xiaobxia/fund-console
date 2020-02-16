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
    <el-alert
      title="在疯狂过后，只有跌回年线一下，才可以继续交易"
      type="warning"/>
    <div :id="id" :style="{height:'600px',width: '100%'}"/>
  </div>
</template>

<script>
import indexList from '@/common/indexList'
import arrayUtil from '@/utils/arrayUtil'
import stockAnalysisUtil from '@/utils/stockAnalysisUtil'
import echarts from 'echarts'

export default {
  name: 'YearLineAll',
  data() {
    return {
      indexKey: 'chuangye',
      indexList,
      dataList: [],
      chart: null,
      indexItem: null,
      id: 'YearLineAll'
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
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const indexRate = this.indexItem.rate
      const recentNetValue = this.dataList
      // 均线
      const recentNetValue2 = this.$getAverageList(recentNetValue, 250)
      const recentNetValue3 = this.$getAverageList(recentNetValue, 120)
      const xData = []
      const yData = []
      const yData2 = []
      const yData3 = []
      const points = []
      const netChangeRatioAll = []
      recentNetValue2.forEach((item) => {
        yData2.push(item)
      })
      recentNetValue3.forEach((item) => {
        yData3.push(item)
      })
      recentNetValue.forEach((item, index) => {
        xData.unshift(item['date'])
        yData.unshift(item['close'])
        netChangeRatioAll.push(item.netChangeRatio)
      })
      // 线差值
      const yData4 = []
      yData.forEach((item, index) => {
        const rate = this.$countDifferenceRate(item, yData2[index])
        let color = '#fff'
        if (rate >= 0) {
          color = 'rgb(208, 153, 183)'
        } else {
          color = 'rgb(112, 220, 240)'
        }
        yData4.push({
          value: rate,
          itemStyle: {
            color: color
          }
        })
      })
      const allLength = netChangeRatioAll.length
      // 画点
      netChangeRatioAll.forEach((item, index) => {
        // 最后几个不要
        if (allLength - 10 <= index) {
          return false
        }
        const show = true
        const nowKline = recentNetValue[index]
        const netChangeRatioList = this.$getNetChangeRatioList(netChangeRatioAll, index)
        const threeDay = stockAnalysisUtil.countDown(netChangeRatioList, 3, 3)
        const date = nowKline['date']
        // const upValue = nowKline['close'] + (nowKline['close'] / 40)
        const downValue = nowKline['close'] - (nowKline['close'] / 100)
        if (threeDay.flag && threeDay.rate < -(3 * indexRate)) {
          if (show) {
            points.push(this.createPoint(date, downValue, '#ff0000'))
          } else {
            return false
          }
        }
        if (stockAnalysisUtil.countDown(netChangeRatioList, 6, 5).flag) {
          if (show) {
            points.push(this.createPoint(date, downValue, '#ff0000'))
          } else {
            return false
          }
        }
        if (stockAnalysisUtil.countDown(netChangeRatioList, 4, 4).flag) {
          if (show) {
            points.push(this.createPoint(date, downValue, '#ff0000'))
          } else {
            return false
          }
        }
        if (stockAnalysisUtil.countDown(netChangeRatioList, 5, 5).flag) {
          if (show) {
            points.push(this.createPoint(date, downValue, 'black'))
          } else {
            return false
          }
        }
        if (stockAnalysisUtil.countDown(netChangeRatioList, 7, 6).flag) {
          if (show) {
            points.push(this.createPoint(date, downValue, 'black'))
          } else {
            return false
          }
        }
        if (stockAnalysisUtil.countDown(netChangeRatioList, 8, 7).flag) {
          if (show) {
            points.push(this.createPoint(date, downValue, 'black'))
          } else {
            return false
          }
        }
        if (stockAnalysisUtil.countDown(netChangeRatioList, 8, 6).flag) {
          if (show) {
            points.push(this.createPoint(date, downValue, 'black'))
          } else {
            return false
          }
        }
        if (stockAnalysisUtil.countDown(netChangeRatioList, 9, 7).flag) {
          if (show) {
            points.push(this.createPoint(date, downValue, 'black'))
          } else {
            return false
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
        series: [
          {
            name: 'K线',
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
              symbolSize: 4
            }
          },
          {
            name: '年线',
            data: yData2,
            type: 'line',
            lineStyle: {
              color: 'rgb(132, 7, 189)'
            },
            smooth: false,
            symbol: 'none'
          },
          {
            name: '半年线',
            data: yData3,
            type: 'line',
            lineStyle: {
              color: '#a80'
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
              data: [{
                yAxis: this.indexItem.topLine,
                lineStyle: {
                  color: '#E6A23C'
                }
              }, {
                yAxis: this.indexItem.cutDownLine,
                lineStyle: {
                  color: '#F56C6C'
                }
              }]
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
