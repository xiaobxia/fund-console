/**
 * Created by xiaobxia on 2018/2/8.
 */
import React, {PureComponent} from 'react'
import {Card, Row, Col} from 'antd';
import ReactEcharts from 'echarts-for-react';
function keep(number) {
  return Math.round(100 * number) / 100
}
class Index extends PureComponent {
  getRecentNetValueOption = () => {
    const list = [
      {
        'x': 0,
        'y': 0
      },
      {
        'x': -0.1,
        'y': 0.5
      },
      {
        'x': -0.2,
        'y': 0.4444444444444444
      },
      {
        'x': -0.30000000000000004,
        'y': 0.14285714285714285
      },
      {
        'x': -0.4,
        'y': 0.1111111111111111
      },
      {
        'x': -0.5,
        'y': 0.5
      },
      {
        'x': -0.6,
        'y': 0.5
      },
      {
        'x': -0.7,
        'y': 0.625
      },
      {
        'x': -0.7999999999999999,
        'y': 0.6153846153846154
      },
      {
        'x': -0.8999999999999999,
        'y': 0.7142857142857143
      },
      {
        'x': -0.9999999999999999,
        'y': 0.75
      },
      {
        'x': -1.0999999999999999,
        'y': 0.75
      },
      {
        'x': -1.2,
        'y': 0
      },
      {
        'x': -1.3,
        'y': 0.25
      },
      {
        'x': -1.4000000000000001,
        'y': 0
      },
      {
        'x': -1.5000000000000002,
        'y': 1
      },
      {
        'x': -1.6000000000000003,
        'y': 0.25
      },
      {
        'x': -1.7000000000000004,
        'y': 0.7142857142857143
      },
      {
        'x': -1.8000000000000005,
        'y': 0
      },
      {
        'x': -1.9000000000000006,
        'y': 0.75
      },
      {
        'x': -2.0000000000000004,
        'y': 1
      },
      {
        'x': -2.1000000000000005,
        'y': 0.3333333333333333
      },
      {
        'x': -2.2000000000000006,
        'y': 0
      },
      {
        'x': -2.3000000000000007,
        'y': 0.3333333333333333
      },
      {
        'x': -2.400000000000001,
        'y': 1
      },
      {
        'x': -2.500000000000001,
        'y': 1
      },
      {
        'x': -2.600000000000001,
        'y': 0
      },
      {
        'x': -2.700000000000001,
        'y': 1
      },
      {
        'x': -2.800000000000001,
        'y': 1
      },
      {
        'x': -2.9000000000000012,
        'y': 0
      },
      {
        'x': -3.0000000000000013,
        'y': 0
      },
      {
        'x': -3.1000000000000014,
        'y': 0
      },
      {
        'x': -3.2000000000000015,
        'y': 0
      },
      {
        'x': -3.3000000000000016,
        'y': 0
      },
      {
        'x': -3.4000000000000017,
        'y': 0
      },
      {
        'x': -3.5000000000000018,
        'y': 0
      },
      {
        'x': -3.600000000000002,
        'y': 0
      },
      {
        'x': -3.700000000000002,
        'y': 0
      },
      {
        'x': -3.800000000000002,
        'y': 0.5
      },
      {
        'x': -3.900000000000002,
        'y': 1
      }
    ]
    // list.reverse()
    let xData = [];
    let yData = [];
    list.forEach(function (item) {
      xData.unshift(item['x']);
      yData.unshift(item['y']);
    });
    return {
      title: {
        text: '变化',
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
          name: '幅度',
          data: yData,
          type: 'line',
          lineStyle: {
            color: '#1890ff'
          }
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
