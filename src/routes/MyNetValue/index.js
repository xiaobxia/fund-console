/**
 * Created by xiaobxia on 2018/1/25.
 */
import React, {PureComponent} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import DocumentTitle from 'react-document-title';
import {Input, Upload, message, Button, Icon, Row, Col, Radio} from 'antd';
import {myNetValueActions} from 'localStore/actions'
import qs from 'qs'
import http from 'localUtil/httpUtil';
import numberUtil from 'localUtil/numberUtil';
import {consoleRender} from 'localUtil/consoleLog'
import PageHeader from 'localComponent/PageHeader'
import {getOpenKeyAndMainPath} from '../../router'
import MyNetValueList from './myNetValueList'
import AddModal from './addModal'
import ReactEcharts from 'echarts-for-react';

import dateUtil from 'localUtil/dateUtil'
import arrayUtil from 'localUtil/arrayUtil'

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


class MyNetValue extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    redirectCount: 0,
    addModal: false,
    modalType: 'add',
    record: {},
    netValueAll: [],
    nowType: '全部'
  };

  componentWillMount() {
    this.initPage();
  }

  componentWillUnmount() {
    this.props.myNetValueActions.initStore();
    console.log('将要卸载MyNetValue');
  }

  initPage = () => {
    const query = this.getSearch();
    //初始化页面
    query.current = query.current || 1;
    query.pageSize = query.pageSize || 10;
    this.queryMyNetValues(query);
    this.queryMyNetValueAll();
    console.log(query)
  };

  getTitle() {
    return getOpenKeyAndMainPath(this.props.location.pathname).title;
  }

  getSearch = () => {
    const search = this.props.location.search;
    let query = {};
    if (search) {
      query = qs.parse(search.slice(1));
    }
    return query;
  };

  queryMyNetValueAll = () => {
    return http.get('userFund/getUserNetValues').then((data) => {
      if (data.success) {
        let list = data.data.list
        this.setState({
          netValueAll: list.reverse()
        })
        // this.myIncomeRateInfo = {
        //   // 当月收益率
        //   nowMonth: this.countSameRangeRate(list, 'month'),
        //   nowYear: this.countSameRangeRate(list, 'year'),
        //   // 总收益率
        //   all: numberUtil.countDifferenceRate(list[list.length - 1]['net_value'], list[0]['net_value'])
        // }
        // this.nowWeekRate.my = this.countSameRangeRate(list, 'week')
        // this.nowMonthRate.my = this.countSameRangeRate(list, 'month')
        // this.nowYearRate.my = this.countSameRangeRate(list, 'year')
      }
    })
  };

  queryMyNetValues = (query) => {
    const {myNetValueActions} = this.props;
    myNetValueActions.queryMyNetValues(query).then((data) => {
      //无数据
      if (data.data.list.length === 0) {
        const query = this.getSearch();
        const current = parseInt(query.current, 10);
        if (current && current > 1) {
          if (this.state.redirectCount > 1) {
            this.props.history.push('/404');
          }
          this.setState((pre) => {
            return {
              redirectCount: pre.redirectCount + 1
            }
          });
          query.current = current - 1;
          this.queryMyNetValuesWithUpdateQuery(query);
        }
      } else {
        this.setState((pre) => {
          return {
            redirectCount: 0
          }
        });
      }
    });
  };
  // 请求数据的同时，更新路由
  queryMyNetValuesWithUpdateQuery = (query) => {
    this.props.history.push('/myNetValue?' + qs.stringify(query));
    this.queryMyNetValues(query);
  };
  // 分页切换
  tableChangeHandler = (pagination, filters, sorter) => {
    const query = this.getSearch();
    query.current = pagination.current;
    query.pageSize = pagination.pageSize;
    this.queryMyNetValuesWithUpdateQuery(query);
    console.log(pagination)
  };
  // 删除基金
  tableDeleteHandler = (netValueDate) => {
    http.get('userFund/deleteUserNetValue', {net_value_date: netValueDate}).then((data) => {
      if (data.success) {
        message.success('删除成功');
      } else {
        message.error('删除失败');
      }
      this.initPage();
    })
  };

  openModalHandler = () => {
    this.setState({
      addModal: true,
      modalType: 'add',
      record: {}
    });
  };

  closeModalHandler = () => {
    this.setState({
      addModal: false
    });
  };

  editHandler = (data) => {
    this.setState({
      addModal: true,
      modalType: 'edit',
      record: data
    });
  };

  addMyNetValue = (data) => {
    return http.post('userFund/addUserNetValue', data).then((data) => {
      if (data.success) {
        this.initPage();
      }
      return data;
    });
  };

  updateMyNetValue = (data) => {
    return http.post('userFund/updateUserNetValue', data).then((data) => {
      if (data.success) {
        this.initPage();
      }
      return data;
    });
  };

  searchHandler = (data) => {
    data.current = 1;
    data.pageSize = 10;
    this.queryMyNetValuesWithUpdateQuery(data);
  };

  onTimeChange = (e) => {
    this.setState({nowType: e.target.value});
  };

  getNetValueOption = () => {
    const {netValueAll} = this.state;
    if (!(netValueAll.length > 1)) {
      return {};
    }
    let xData = [];
    let yData = [];
    let yData11 = []
    const baseMy = netValueAll[0]['net_value']

    let myList = arrayUtil.copy(netValueAll)
    // 近一年数据
    let startIndex = 0
    if (this.state.nowType === '本月') {
      startIndex = dateUtil.findSameRangeStartNetValueIndex(myList, 'month')
    } else if (this.state.nowType === '本年') {
      startIndex = dateUtil.findSameRangeStartNetValueIndex(myList, 'year')
    } else if (this.state.nowType === '进一年') {
      startIndex = netValueAll.length > 250 ? (netValueAll.length) - 250 : 0
    }
    myList = myList.slice(startIndex)
    myList.forEach(function (item, index) {
      xData.push(item.net_value_date);
      // yData.push(numberUtil.keepTwoDecimals(((item['net_value'] - baseMy) / baseMy) * 100));
      yData.push(item['net_value']);
      yData11.push(item['position'] || 0)
    });
    return {
      title: {
        text: '我的净值',
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
      yAxis: [
        {
          name: '净值',
          type: 'value',
          scale: true
        },
        {
          name: '仓位',
          type: 'value',
          min: 0,
          max: 150
        }
      ],
      series: [
        {
          name: '净值',
          data: yData,
          type: 'line',
          smooth: false,
          symbol: 'none',
          lineStyle: {
            color: '#f50'
          }
        },
        {
          name: '仓位',
          data: yData11,
          type: 'bar',
          yAxisIndex: 1,
          lineStyle: {
            color: '#f50'
          }
        }
      ]
    };
  }

  render() {
    const {myNetValue} = this.props;
    const {pagination} = myNetValue;
    consoleRender('MyNetValue render');
    const title = this.getTitle();
    const listProps = {
      pagination: {...pagination, showTotal: total => `共 ${total} 条记录`},
      dataSource: myNetValue.myNetValueList,
      onChange: this.tableChangeHandler,
      onDelete: this.tableDeleteHandler,
      tableLoading: myNetValue.tableLoading,
      onEditHandler: this.editHandler
    };
    const modalProps = {
      onClose: this.closeModalHandler,
      onAdd: this.addMyNetValue,
      onUpdate: this.updateMyNetValue,
      type: this.state.modalType,
      record: this.state.record
    };
    return (
      <DocumentTitle title={title}>
        <div className="module-my-myNetValue route-modules">
          <PageHeader routeTitle={title}>
            <Row className="page-header-content">
              <Col span={8}>
              </Col>
              <Col span={8}>
                <RadioGroup onChange={this.onTimeChange} defaultValue="全部">
                  <RadioButton value="全部">全部</RadioButton>
                  <RadioButton value="本年">本年</RadioButton>
                  <RadioButton value="本月">本月</RadioButton>
                  <RadioButton value="近一年">近一年</RadioButton>
                </RadioGroup>
              </Col>
              <Col span={8} style={{textAlign: 'right'}}>
                <Button.Group>
                  <Button onClick={this.openModalHandler}>
                    添加记录
                  </Button>
                </Button.Group>
              </Col>
            </Row>
          </PageHeader>
          <div className="content-card-wrap">
            <ReactEcharts
              option={this.getNetValueOption()}
              notMerge={true}
              style={{height: '400px'}}
              lazyUpdate={true}
              theme={'theme_name'}
            />
          </div>
          <div className="content-card-wrap">
            <MyNetValueList {...listProps}/>
          </div>
          {this.state.addModal && <AddModal {...modalProps}/>}
        </div>
      </DocumentTitle>
    );
  }
}


const mapStateToProps = state => {
  return {
    myNetValue: state.myNetValue
  }
};

const mapDispatchToProps = dispatch => ({
  //action在此为引入
  myNetValueActions: bindActionCreators(myNetValueActions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MyNetValue));
