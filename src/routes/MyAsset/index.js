/**
 * Created by xiaobxia on 2018/2/7.
 */
import React, {PureComponent} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import DocumentTitle from 'react-document-title';
import {Input, message, Button, Icon, Row, Col, Tag} from 'antd';
import {fundActions} from 'localStore/actions'
import numberUtil from 'localUtil/numberUtil';
import {consoleRender} from 'localUtil/consoleLog'
import PageHeader from 'localComponent/PageHeader'
import {getOpenKeyAndMainPath} from '../../router'
import ReactEcharts from 'echarts-for-react';
import http from 'localUtil/httpUtil';


class MyAsset extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    list: [],
    shangzheng: [],
    chuangye: [],
    hushen: []
  };

  componentWillMount() {
    this.initPage();
  }


  componentWillUnmount() {
    console.log('将要卸载MyAsset');
  }

  initPage = () => {
    http.get('userFund/getUserNetValues').then((data) => {
      if (data.success) {
        this.setState({
          list: data.data.list
        })
      }
    });
    http.get('webData/getWebStockdaybar', {
      code: 'sh000001'
    }).then((data) => {
      if (data.success) {
        this.setState({
          shangzheng: data.data.list
        })
      }
    });
    http.get('webData/getWebStockdaybar', {
      code: 'sz399006'
    }).then((data) => {
      if (data.success) {
        this.setState({
          chuangye: data.data.list
        })
      }
    });
    http.get('webData/getWebStockdaybar', {
      code: 'sz399300'
    }).then((data) => {
      if (data.success) {
        this.setState({
          hushen: data.data.list
        })
      }
    });
  };

  getTitle() {
    return getOpenKeyAndMainPath(this.props.location.pathname).title;
  }

  getNetValueOption = () => {
    const listMonth = this.state.list;
    let listShangzheng = this.state.shangzheng;
    let listChuangye = this.state.chuangye;
    let listHushen = this.state.hushen;
    let startIndex = 0;
    for (let i = 0; i < listShangzheng.length; i++) {
      if (listShangzheng[i].date === 20180312) {
        startIndex = i;
        break;
      }
    }
    listShangzheng = listShangzheng.slice(0, startIndex + 1);
    listShangzheng.reverse();
    listChuangye = listChuangye.slice(0, startIndex + 1);
    listChuangye.reverse();
    listHushen = listHushen.slice(0, startIndex + 1);
    listHushen.reverse();
    if (listShangzheng.length < 1 || listChuangye.length < 1 || listHushen.length < 1) {
      return {};
    }
    const baseShangzheng = listShangzheng[0].kline.close;
    const baseChuangye = listChuangye[0].kline.close;
    const baseHushen = listHushen[0].kline.close;
    let xData = [];
    let yData = [];
    let y2Data = [];
    let y3Data = [];
    let y4Data = [];
    listMonth.forEach(function (item, index) {
      xData.push(item['net_value_date']);
      yData.push(numberUtil.keepTwoDecimals((item['net_value'] - 1) * 100));
      y2Data.push(numberUtil.keepTwoDecimals(((listShangzheng[index].kline.close - baseShangzheng) / baseShangzheng) * 100));
      y3Data.push(numberUtil.keepTwoDecimals(((listChuangye[index].kline.close - baseChuangye) / baseChuangye) * 100));
      y4Data.push(numberUtil.keepTwoDecimals(((listHushen[index].kline.close - baseHushen) / baseHushen) * 100));
    });
    return {
      color: ['#1890ff', '#f50', '#13c2c2', '#52c41a'],
      title: {
        text: '净值曲线',
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
      legend: {
        data: ['我的组合', '上证指数', '创业指数', '沪深300指数']
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
          name: '我的组合',
          data: yData,
          type: 'line',
          lineStyle: {
            color: '#1890ff'
          }
        },
        {
          name: '上证指数',
          data: y2Data,
          type: 'line',
          lineStyle: {
            color: '#f50'
          }
        },
        {
          name: '创业指数',
          data: y3Data,
          type: 'line',
          lineStyle: {
            color: '#13c2c2'
          }
        },
        {
          name: '沪深300指数',
          data: y4Data,
          type: 'line',
          lineStyle: {
            color: '#52c41a'
          }
        }
      ]
    };
  };

  render() {
    const title = this.getTitle();
    return (
      <DocumentTitle title={title}>
        <div className="module-my-fund route-modules">
          <PageHeader routeTitle={title}>
          </PageHeader>
          <div className="content-card-wrap no-padding">
            <ReactEcharts
              option={this.getNetValueOption()}
              notMerge={true}
              style={{height: '600px'}}
              lazyUpdate={true}
              theme={'theme_name'}
            />
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default withRouter(MyAsset);
