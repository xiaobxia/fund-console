/**
 * Created by xiaobxia on 2018/1/26.
 */
import React, {PureComponent} from 'react'
import {Table, Button, Divider, Popconfirm} from 'antd';
import {Link} from 'react-router-dom'
import numberUtil from 'localUtil/numberUtil';
import rateChart from 'localUtil/rateChart';
import ReactEcharts from 'echarts-for-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class IndexList extends PureComponent {

  getChartOption = () => {
    const recentNetValue = this.props.dataSource;
    let xData = [];
    let yData = [];
    let yData2 = [];
    recentNetValue.forEach((item, index) => {
      const netChangeRatio = item['netChangeRatio']
      xData.unshift(item['date']);
      yData2.unshift(item['close']);
      yData.unshift({
        value: netChangeRatio,
        itemStyle: {
          color: netChangeRatio < -4 ? 'rgb(208, 153, 183)' : 'rgb(112, 220, 240)'
        }
      });
    });
    return {
      title: {
        text: '幅值变化',
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
      xAxis: {
        type: 'category',
        data: xData
      },
      yAxis: [
        {
          type: 'value',
          name: '点数',
          scale: true
        },
        {
          type: 'value',
          name: '差值'
        }
      ],
      series: [
        {
          name: '净值',
          data: yData2,
          type: 'line',
          lineStyle: {
            color: '#1890ff'
          },
          smooth: false,
          symbol: 'none'
        },
        {
          name: '幅值',
          yAxisIndex: 1,
          data: yData,
          type: 'bar'
        }
      ]
    };
  };

  render() {
    const {dataSource} = this.props;
    return (
      <div>
        <ReactEcharts
          option={this.getChartOption(dataSource)}
          notMerge={true}
          style={{height: '300px'}}
          lazyUpdate={true}
          theme={'theme_name'}
        />
      </div>
    );
  }
}

export default IndexList;
