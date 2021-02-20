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
        const list = []
        res.data.forEach((item) => {
          item.netChangeRatio = this.$countDifferenceRate(item.close, item.open)
          list.push(item)
        })
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
      const xData = []
      const yData = []
      const points = []
      // 最近的在前面
      const netChangeRatioAll = []
      recentNetValue.forEach((item, index) => {
        xData.unshift(moment(item['tradeDate']).format('YYYY-MM-DD'))
        yData.unshift(item['close'])
        netChangeRatioAll.push(item.netChangeRatio)
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
              color: '#909399'
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
              color: 'rgb(132, 7, 189)'
            },
            smooth: false,
            symbol: 'none'
          },
          {
            name: '10日线',
            data: list10,
            type: 'line',
            lineStyle: {
              color: '#a80'
            },
            smooth: false,
            symbol: 'none'
          },
          {
            name: '20日线',
            data: list20,
            type: 'line',
            lineStyle: {
              color: '#F56C6C'
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
