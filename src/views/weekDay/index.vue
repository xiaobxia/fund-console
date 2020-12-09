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
import echarts from 'echarts'
import moment from 'moment'

export default {
  name: 'WeekDay',
  data() {
    return {
      indexKey: 'chuangye',
      indexList,
      dataList: [],
      chart: null,
      indexItem: null,
      id: 'QuarterLine'
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
      const recentNetValue = this.dataList
      const xData = []
      const yData = []
      const map = {
        '1': [],
        '2': [],
        '3': [],
        '4': [],
        '5': []
      }
      recentNetValue.forEach((item, index) => {
        const day = moment(item['date']).day()
        map['' + day].push(item['netChangeRatio'])
      })
      for (const key in map) {
        xData.push(key)
        const list = map[key]
        let count = 0
        list.forEach((v) => {
          if (v > 0) {
            count++
          }
        })
        console.log(list.length)
        yData.push(parseInt((count / list.length) * 100))
      }
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
            name: '概率',
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '概率',
            data: yData,
            type: 'bar',
            lineStyle: {
              color: '#1890ff'
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
