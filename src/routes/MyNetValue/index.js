/**
 * Created by xiaobxia on 2018/1/25.
 */
import React, {PureComponent} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import DocumentTitle from 'react-document-title';
import {Input, Upload, message, Button, Icon, Row, Col} from 'antd';
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


class MyNetValue extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    redirectCount: 0,
    addModal: false,
    modalType: 'add',
    record: {},
    netValueAll: []
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
    return http.get('fund/getUserNetValuesAll').then((data) => {
      if (data.success) {
        let list = data.data.list
        this.setState({
          netValueAll: list
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
    http.get('fund/deleteUserNetValue', {net_value_date: netValueDate}).then((data) => {
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
    return http.post('fund/addUserNetValue', data).then((data) => {
      if (data.success) {
        this.initPage();
      }
      return data;
    });
  };

  updateMyNetValue = (data) => {
    return http.post('fund/updateUserNetValue', data).then((data) => {
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

  getNetValueOption = () => {
    const {netValueAll} = this.state;
    if (!(netValueAll.length > 1)) {
      return {};
    }
    let xData = [];
    let yData = [];
    const baseMy = netValueAll[0]['net_value']
    netValueAll.forEach(function (item, index) {
      xData.push(item.net_value_date);
      // yData.push(numberUtil.keepTwoDecimals(((item['net_value'] - baseMy) / baseMy) * 100));
      yData.push(item['net_value']);
    });
    return {
      title: {
        text: '我的收益率',
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
          smooth: false,
          symbol: 'none',
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
