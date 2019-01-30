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
    my: []
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
  }
  getRecentNetValueOption = () => {
    let list = this.state.my
    // list.reverse()
    let xData = [];
    let yData = [];
    list.forEach(function (item) {
      xData.unshift(item['yearMonth']);
      yData.unshift(item['rate']);
    });
    return {
      title: {
        text: '月收益率',
        left: 'center',
        textStyle: {
          color: 'rgba(0, 0, 0, 0.85)',
          fontWeight: '500'
        }
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
