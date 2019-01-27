/**
 * Created by xiaobxia on 2018/1/26.
 */
import React, {PureComponent} from 'react'
import {Table, Button, Divider, Popconfirm} from 'antd';
import {Link} from 'react-router-dom'
import numberUtil from 'localUtil/numberUtil';
import ReactEcharts from 'echarts-for-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';

class IndexList extends PureComponent {

  getChartOption = () => {
    const chuangye = this.props.chuangye;
    const wulin = this.props.wulin;
    if (chuangye.length !== wulin.length) {
      return {}
    }
    let xData = [];
    let yDataChuangye = [];
    let yDataWulin = [];
    let points = [];
    let points2 = [];
    chuangye.forEach((item, index) => {
      xData.unshift(item['date']);
      let chuangyeRate = item.kline['netChangeRatio']
      let wulinRate = wulin[index].kline['netChangeRatio']
      yDataChuangye.unshift(item.kline['close']);
      yDataWulin.unshift(wulin[index].kline['close']);
      const rateChuangye = 0.94
      const rateWulin = 0.73
      let bigRateChuangye = Math.abs(chuangyeRate - wulinRate) > rateChuangye * 2
      let bigRateWulin = Math.abs(chuangyeRate - wulinRate) > rateWulin * 2
      let tempFlag = Math.abs(chuangyeRate - wulinRate) > rateChuangye
      if (tempFlag && chuangyeRate > 0 && chuangyeRate > wulinRate && chuangyeRate > rateChuangye) {
        points.push({
          coord: [item['date'], item.kline['close']],
          itemStyle: {
            normal: {
              color: 'green'
            }
          },
          label: {
            show: false
          }
        })
      } else if (bigRateChuangye && chuangyeRate < 0 && chuangyeRate < wulinRate && chuangyeRate < -rateChuangye) {
        points.push({
          coord: [item['date'], item.kline['close']],
          itemStyle: {
            normal: {
              color: 'red'
            }
          },
          label: {
            show: false
          }
        })
      } else if (bigRateWulin && wulinRate > 0 && wulinRate > chuangyeRate && wulinRate > rateWulin) {
        points2.push({
          coord: [item['date'], wulin[index].kline['close']],
          itemStyle: {
            normal: {
              color: 'green'
            }
          },
          label: {
            show: false
          }
        })
      } else if (bigRateWulin && wulinRate < 0 && wulinRate < chuangyeRate && wulinRate < -rateWulin) {
        points2.push({
          coord: [item['date'], wulin[index].kline['close']],
          itemStyle: {
            normal: {
              color: 'red'
            }
          },
          label: {
            show: false
          }
        })
      }
    });
    return {
      title: {
        text: '净值变化',
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
      yAxis: {
        type: 'value',
        scale: true
      },
      series: [
        {
          name: '创业',
          data: yDataChuangye,
          type: 'line',
          lineStyle: {
            color: '#1890ff'
          },
          smooth: false,
          symbol: 'none',
          markPoint: {
            data: points,
            symbol: 'circle',
            symbolSize: 6
          }
        },
        {
          name: '50',
          data: yDataWulin,
          type: 'line',
          lineStyle: {
            color: '#ff125f'
          },
          smooth: false,
          symbol: 'none',
          markPoint: {
            data: points2,
            symbol: 'circle',
            symbolSize: 6
          }
        }
      ]
    };
  };

  render() {
    const columns = [
      {
        title: '日期',
        width: 80,
        dataIndex: 'date'
      },
      {
        title: '创业幅度',
        width: 50,
        render: (record) => {
          const rate = numberUtil.keepTwoDecimals(record.chuangye);
          return <span className={rate > 0 ? 'red-text' : 'green-text'}>{rate}</span>
        }
      },
      {
        title: '50幅度',
        width: 50,
        render: (record) => {
          const rate = numberUtil.keepTwoDecimals(record.wulin);
          return <span className={rate > 0 ? 'red-text' : 'green-text'}>{rate}</span>
        }
      }
    ];
    const {dataSource, chuangye, wulin} = this.props;
    return (
      <div>
        <ReactEcharts
          option={this.getChartOption(chuangye, wulin)}
          notMerge={true}
          style={{height: '300px'}}
          lazyUpdate={true}
          theme={'theme_name'}
        />
        <Table
          dataSource={dataSource}
          columns={columns}
          simple
          pagination={false}
          size="small"
          rowKey={record => record.date}
        />
      </div>
    );
  }
}

export default IndexList;
