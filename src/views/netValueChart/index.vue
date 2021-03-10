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
    <div>
      <el-row>
        <el-col :span="6">
          <span>当前：{{ nowBack }}%</span>
        </el-col>
        <el-col :span="6">
          <span>最大：{{ maxBack }}%</span>
        </el-col>
      </el-row>
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
      kLineList: [],
      nowBack: 0,
      maxBack: 0
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
        const maxItem = this.getMaxItem()
        const nowItem = this.netValueList[this.netValueList.length - 1]
        this.nowBack = this.$countDifferenceRate(nowItem.net_value, maxItem.net_value)
        const maxBackList = this.getMaxBack(this.netValueList)
        this.maxBack = maxBackList[0].diff
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
          item.value = this.$countDifferenceRate(item.net_value, base)
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
          item.value = this.$countDifferenceRate(item.close, base)
        })
        this.kLineList = list
      })
    },
    printHanlder() {
    },
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
    getThenMin(netValueList, start, now) {
      let min = netValueList[start]
      for (let i = start; i < netValueList.length; i++) {
        const item = netValueList[i]
        // 有新高
        if (item.net_value > now) {
          break
        }
        if (min.net_value) {
          if (item.net_value <= min.net_value) {
            min = {
              ...item,
              index: i
            }
          }
        } else {
          min = {
            ...item,
            index: i
          }
        }
      }
      return min
    },
    getMaxBack(netValueList) {
      const list = []
      netValueList.forEach((item, index) => {
        const data = {
          minValue: 0,
          minDate: '',
          minIndex: 0,
          maxValue: item.net_value,
          maxDate: item.net_value_date,
          maxIndex: index
        }
        const min = this.getThenMin(netValueList, index, item.net_value)
        data.minValue = min.net_value
        data.minDate = min.net_value_date
        data.minIndex = min.index
        data.diff = this.$countDifferenceRate(data.minValue, data.maxValue)
        list.push(data)
      })
      list.sort((a, b) => {
        return a.diff - b.diff
      })
      return list
    },
    getMaxItem() {
      let data = {
        net_value: 0
      }
      this.netValueList.forEach((item, index) => {
        if (item.net_value > data.net_value) {
          data = item
        }
      })
      return data
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      const xData = []
      const yData = []
      const yData2 = []
      const yData3 = []
      const points = []
      // 最近的在前面
      this.netValueList.forEach((item, index) => {
        xData.push(item['net_value_date'])
        yData.push(item['value'])
        yData3.push({
          value: item['position'],
          itemStyle: {
            color: item['position'] > 100 ? 'rgba(230,162,60,0.7)' : 'rgba(230,162,60,0.4)'
          }
        })
        yData2.push(this.kLineList[index]['value'])
      })
      const maxBackList = this.getMaxBack(this.netValueList)
      const maxD = maxBackList[0]
      points.push(this.createPoint(
        maxD.maxDate,
        yData[maxD.maxIndex],
        '#000',
        '回撤高点'
      ))
      points.push(this.createPoint(
        maxD.minDate,
        yData[maxD.minIndex],
        '#000',
        '回撤低点'
      ))
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
          },
          {
            type: 'value',
            name: '仓位',
            splitLine: {
              show: false
            }
          }
        ],
        // visualMap: {
        //   type: 'piecewise',
        //   show: false,
        //   dimension: 0,
        //   seriesIndex: 0,
        //   pieces: [{
        //     gt: maxBackList[0].maxIndex,
        //     lte: maxBackList[0].minIndex,
        //     color: '#000'
        //   }]
        // },
        series: [
          {
            name: '净值',
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
              symbolSize: 6
            }
            // areaStyle: {}
          },
          {
            name: '沪深300',
            data: yData2,
            type: 'line',
            lineStyle: {
              color: '#909399'
            },
            smooth: false,
            symbol: 'none'
          },
          {
            name: '仓位',
            data: yData3,
            yAxisIndex: 1,
            type: 'bar',
            markLine: {
              silent: true,
              data: [
                {
                  yAxis: 100,
                  lineStyle: {
                    color: '#F56C6C'
                  }
                }
              ]
            }
            // itemStyle: {
            //   color: 'rgba(230,162,60,0.4)'
            // }
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
