/**
 * Created by xiaobxia on 2018/1/25.
 */
import React, {PureComponent} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import DocumentTitle from 'react-document-title';
import {Input, Upload, message, Button, Icon, Row, Col} from 'antd';
import {fundActions} from 'localStore/actions'
import qs from 'qs'
import http from 'localUtil/httpUtil';
import {consoleRender} from 'localUtil/consoleLog'
import PageHeader from 'localComponent/PageHeader'
import {getOpenKeyAndMainPath} from '../../router'
import FundList from './fundList'
import AddModal from './addModal'
import Search from './search'
import OptionBlock from './optionBlock'

class Fund extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    redirectCount: 0,
    addModal: false
  };

  componentWillMount() {
    this.initPage();
  }

  componentWillUnmount() {
    this.props.fundActions.initStore();
    console.log('将要卸载Fund');
  }

  initPage = () => {
    const query = this.getSearch();
    //初始化页面
    query.current = query.current || 1;
    query.pageSize = query.pageSize || 40;
    this.queryFunds(query);
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

  queryFunds = (query) => {
    const {fundActions} = this.props;
    fundActions.queryFunds(query).then((data) => {
      //无数据
      let temp = []
      data.data.list.forEach((item) => {
        if (item.theme) {
          temp.push({
            code: item.code,
            theme: item.theme
          })
        }
      })
      console.log(JSON.stringify(temp))
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
          this.queryFundsWithUpdateQuery(query);
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
  queryFundsWithUpdateQuery = (query) => {
    this.props.history.push('/fund?' + qs.stringify(query));
    this.queryFunds(query);
  };
  // 分页切换
  tableChangeHandler = (pagination, filters, sorter) => {
    const query = this.getSearch();
    query.current = pagination.current;
    query.pageSize = pagination.pageSize;
    this.queryFundsWithUpdateQuery(query);
    console.log(pagination)
  };
  // 删除基金
  tableDeleteHandler = (code) => {
    http.get('fund/deleteFund', {code}).then((data) => {
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
      addModal: true
    });
  };

  closeModalHandler = () => {
    this.setState({
      addModal: false
    });
  };

  addFund = (code) => {
    return http.post('fund/addFund', {code}).then((data) => {
      if (data.success) {
        this.initPage();
      }
      return data;
    });
  };

  searchHandler = (data) => {
    data.current = 1;
    data.pageSize = 40;
    this.queryFundsWithUpdateQuery(data);
  };

  render() {
    const {fund} = this.props;
    const {pagination} = fund;
    consoleRender('Fund render');
    const title = this.getTitle();
    const listProps = {
      pagination: {...pagination, showTotal: total => `共 ${total} 条记录`},
      dataSource: fund.fundList,
      onChange: this.tableChangeHandler,
      onDelete: this.tableDeleteHandler,
      tableLoading: fund.tableLoading
    };
    const modalProps = {
      onClose: this.closeModalHandler,
      onAdd: this.addFund
    };
    return (
      <DocumentTitle title={title}>
        <div className="module-my-fund route-modules">
          <PageHeader routeTitle={title}>
            <Row className="page-header-content">
              <Col span={8} style={{lineHeight: '32px', textAlign: 'center'}}>
                <Search onSearch={this.searchHandler}/>
              </Col>
              <Col span={8} style={{textAlign: 'left'}}>
                <Button.Group>
                  <Button onClick={this.openModalHandler}>
                    添加基金
                  </Button>
                </Button.Group>
              </Col>
            </Row>
          </PageHeader>
          <div className="content-card-wrap" style={{textAlign: 'center'}}>
            <OptionBlock/>
          </div>
          <div className="content-card-wrap">
            <FundList {...listProps}/>
          </div>
          {this.state.addModal && <AddModal {...modalProps}/>}
        </div>
      </DocumentTitle>
    );
  }
}


const mapStateToProps = state => {
  return {
    fund: state.fund
  }
};

const mapDispatchToProps = dispatch => ({
  //action在此为引入
  fundActions: bindActionCreators(fundActions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Fund));
