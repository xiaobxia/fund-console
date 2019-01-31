/**
 * Created by xiaobxia on 2018/2/8.
 */
import React, {PureComponent} from 'react'
import {Card, Row, Col} from 'antd';
import ReactEcharts from 'echarts-for-react';
import http from 'localUtil/httpUtil';

function keep(number) {
  return Math.round(100 * number) / 100
}
class Index extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    my: [],
    shangzheng: [],
    chuangye: [],
    hushen: [],
    wulin: []
  };
  componentWillMount() {
    this.initPage();
  }
  initPage = () => {
    http.get('userFund/getUserNetValueMonthRate').then((data) => {
      if (data.success) {
        this.setState({
          my: data.data.list
        })
      }
    })
    http.get('stock/getStockPriceMonthRate', {
      code: 'sh000001',
      start: '20180309'
    }).then((data) => {
      if (data.success) {
        this.setState({
          shangzheng: data.data
        })
      }
    })
    http.get('stock/getStockPriceMonthRate', {
      code: 'sz399006',
      start: '20180309'
    }).then((data) => {
      if (data.success) {
        this.setState({
          chuangye: data.data
        })
      }
    })
    http.get('stock/getStockPriceMonthRate', {
      code: 'sh000300',
      start: '20180309'
    }).then((data) => {
      if (data.success) {
        this.setState({
          hushen: data.data
        })
      }
    })
    http.get('stock/getStockPriceMonthRate', {
      code: 'sh000016',
      start: '20180309'
    }).then((data) => {
      if (data.success) {
        this.setState({
          wulin: data.data
        })
      }
    })
  }
  getRecentNetValueOption = () => {
    let list = this.state.my
    // list.reverse()
    let xData = [];
    let yData = [];
    let yDataShangzheng = []
    let yDataChuangye = []
    let yDataHushen = []
    let yDataWulin = []
    let shangzheng = this.state.shangzheng
    let chuangye = this.state.chuangye
    let hushen = this.state.hushen
    let wulin = this.state.wulin
    if (list.length && shangzheng.length && chuangye.length && hushen.length && wulin.length) {
    } else {
      return {}
    }
    console.log(list)
    console.log(list.map)
    list.map((item, index) => {
      xData.push(item['yearMonth']);
      yData.push(item['rate']);
      yDataShangzheng.push(shangzheng[index]['rate'])
      yDataChuangye.push(chuangye[index]['rate'])
      yDataHushen.push(hushen[index]['rate'])
      yDataWulin.push(wulin[index]['rate'])
    });
    return {
      // title: {
      //   text: '月收益率',
      //   left: 'center',
      //   textStyle: {
      //     color: 'rgba(0, 0, 0, 0.85)',
      //     fontWeight: '500'
      //   }
      // },
      legend: {
        data: ['我的', '上证', '创业', '沪深', '50']
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      calculable: true,
      xAxis: {
        type: 'category',
        data: xData
      },
      yAxis: {
        type: 'value',
        scale: true
      },
      series: [
        {
          name: '我的',
          data: yData,
          type: 'bar'
        },
        {
          name: '上证',
          data: yDataShangzheng,
          type: 'bar'
        },
        {
          name: '创业',
          data: yDataChuangye,
          type: 'bar'
        },
        {
          name: '沪深',
          data: yDataHushen,
          type: 'bar'
        },
        {
          name: '50',
          data: yDataWulin,
          type: 'bar'
        }
      ]
    };
  };

  render() {
    return (
      <div>
        <ReactEcharts
          option={this.getRecentNetValueOption()}
          notMerge={true}
          style={{height: '600px'}}
          lazyUpdate={true}
          theme={'theme_name'}
        />
      </div>
    );
  }
}

export default Index;
