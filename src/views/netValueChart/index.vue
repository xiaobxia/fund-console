<template>
  <div class="app-container">
    <div class="filter-container">
      <div class="left-block">
        <el-date-picker
          v-model="dateRangeList"
          style="width: 100%"
          size="small"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          value-format="yyyy-MM-dd"
          end-placeholder="结束日期"
        />
        <el-button
          type="primary"
          size="small"
          @click="createPage"
        >查询</el-button>
      </div>
    </div>
    <div id="NetValue-wrap" class="chart-wrap">
      <div :id="id" :style="{height:'400px',width: '100%'}"/>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import moment from 'moment'

const myStartDay = '2020-01-01'

export default {
  name: 'NetValue',
  data() {
    return {
      dataList: [myStartDay, moment().format('YYYY-MM-DD')],
      chart: null,
      indexItem: null,
      id: 'netValueChart',
      signList: [],
      dateRangeList: [],
      days: 40,
      netValueList: [],
      kLineList: []
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
    this.createPage()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    createPage() {
      Promise.all([
        this.queryNetValue(),
        this.queryLineBase()
      ]).then(() => {
        this.initChart()
      })
    },
    queryNetValue() {
      const start = this.dateRangeList[0] || myStartDay
      const end = this.dateRangeList[1] || moment().format('YYYY-MM-DD')
      return this.$http.get('userFund/getUserNetValuesByStartEnd', {
        start,
        end
      }).then((res) => {
        const list = res.data.list
        const base = list[0].pre_net_value
        list.forEach((item) => {
          item.value = this.countDifferenceRate(item.net_value, base)
        })
        this.netValueList = list
      })
    },
    queryLineBase() {
      const start = this.dateRangeList[0] || myStartDay
      return this.$http.get('stock/getStockPriceDayKlineByStart', {
        code: 'sh000300',
        start: start
      }).then((res) => {
        const list = res.data
        const base = list[0].preClose
        list.forEach((item) => {
          item.value = this.countDifferenceRate(item.close, base)
        })
        this.kLineList = list
      })
    },
    printHanlder() {
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const recentNetValue = this.dataList
      const xData = []
      const yData = []
      const points = []
      // 最近的在前面
      const netChangeRatioAll = []
      recentNetValue.forEach((item, index) => {
        xData.unshift(item['date'])
        yData.unshift(item['close'])
        const buy = this.getSign(item['date'], this.indexItem.key)
        if (buy) {
          points.push(this.createPoint(item['date'], item['close'], 'red', buy))
        }
        netChangeRatioAll.push(item.netChangeRatio)
      })
      this.chart.setOption({
        title: {
          text: `净值`,
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
              show: true,
              lineStyle: {
                type: 'dashed'
              }
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
              symbolSize: 10
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
  .chart-wrap {
    padding-top: 10px;
    position: relative;
    border: 1px solid #ddd;
    .name {
      text-align: center;
    }
  }
</style>
