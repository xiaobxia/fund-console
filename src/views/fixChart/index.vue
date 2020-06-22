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
    <el-button @click="printHanlder">打印</el-button>
    <div id="FixChart-wrap">
      <div :id="id" :style="{height:'600px',width: '100%'}"/>
    </div>
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
    printHanlder() {
      this.$getDomImg('FixChart-wrap')
    },
    createPoint(date, value, color, sign) {
      return {
        coord: [date, value],
        itemStyle: {
          normal: {
            color: color
          }
        },
        label: {
          show: true,
          formatter: () => {
            return `${moment(date).format('YYYY-MM-DD')}\n定投:${sign}`
          },
          fontSize: 12,
          color: color,
          position: 'top'
          // backgroundColor: '#fff',
          // borderWidth: 1,
          // borderColor: '#B6C5F3',
          // padding: 10
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
          const fixRecord = item.fix_record || []
          for (let j = 0; j < fixRecord.length; j++) {
            const fixItem = fixRecord[j]
            if (fixItem.key === key) {
              return fixItem.buy
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
        const buy = this.getSign(item['date'], this.indexItem.key)
        if (buy) {
          points.push(this.createPoint(item['date'], item['close'], 'red', buy))
        }
        netChangeRatioAll.push(item.netChangeRatio)
      })
      this.chart.setOption({
        title: {
          text: `定投-${this.indexItem.name}`,
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
