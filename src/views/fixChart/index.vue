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
import echarts from 'echarts'
import moment from 'moment'

export default {
  name: 'FixChart',
  data() {
    return {
      indexKey: 'chuangye',
      indexList,
      dataList: [],
      chart: null,
      indexItem: null,
      id: 'FixChart',
      signList: []
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
    this.querySign().then(() => {
      this.initPage()
    })
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
    querySign() {
      return this.$http.get('http://47.92.210.171:3051/fbsServer/signal/getSignalsByDays', {
        days: 20
      }).then((res) => {
        this.signList = res.data || []
      })
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
        days: 20
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
    getSign(date, key) {
      date = moment(date).format('YYYY-MM-DD')
      for (let i = 0; i < this.signList.length; i++) {
        const item = this.signList[i]
        if (item.trade_date === date) {
          const bandRecord = item.band_record || []
          for (let j = 0; j < bandRecord.length; j++) {
            const bandItem = bandRecord[j]
            if (bandItem.key === key) {
              return bandItem.flag
            }
          }
        }
      }
      return ''
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
        const sign = this.getSign(item['date'], this.indexItem.key)
        if (sign) {
          if (sign.indexOf('加') !== -1) {
            points.push(this.createPoint(item['date'], item['close'], 'red'))
          } else if (sign.indexOf('减') !== -1) {
            points.push(this.createPoint(item['date'], item['close'], 'green'))
          }
        }
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
        yAxis: [
          {
            type: 'value',
            name: '点数',
            scale: true,
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
              symbolSize: 8
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
