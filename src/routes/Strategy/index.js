/**
 * Created by xiaobxia on 2018/2/8.
 */
import React, {PureComponent} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import DocumentTitle from 'react-document-title';
import {Input, Upload, message, Button, Icon, Row, Col, Tabs} from 'antd';
import {strategyActions} from 'localStore/actions'
import {consoleRender} from 'localUtil/consoleLog'
import PageHeader from 'localComponent/PageHeader'
import {getOpenKeyAndMainPath} from '../../router'
import http from 'localUtil/httpUtil';
import FundList from './fundList'
import MyFundList from './myFundList'
import qs from 'qs'

const {TabPane} = Tabs;

class Strategy extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    updateLoading: false,
    addModal: false,
    tabKey: '1'
  };

  componentWillMount() {
    const query = this.getSearch();
    if (query.key) {
      this.setState({tabKey: query.key});
    }
    this.initPage();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.props.strategyActions.initStore();
    console.log('将要卸载Strategy');
  }

  getSearch = () => {
    const search = this.props.location.search;
    let query = {};
    if (search) {
      query = qs.parse(search.slice(1));
    }
    return query;
  };

  initPage = () => {
    this.queryStrategy();
    this.props.strategyActions.queryMyStrategy();
  };

  queryStrategy = (force) => {
    this.props.strategyActions.queryStrategy(force);
  };

  queryStrategyForce = () => {
    this.queryStrategy(true);
  };

  tabChangeHandler = (value) => {
    console.log(value)
    this.props.history.push('/strategy?' + qs.stringify({
      key: value
    }));
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

  getTitle() {
    return getOpenKeyAndMainPath(this.props.location.pathname).title;
  }

  render() {
    consoleRender('Strategy render');
    const title = this.getTitle();
    const strategy = this.props.strategy;
    const modalProps = {
      onClose: this.closeModalHandler,
      onAdd: this.addFund
    };
    return (
      <DocumentTitle title={title}>
        <div className="module-my-fund route-modules">
          <PageHeader routeTitle={title}>
            <Row className="page-header-content">
              <Col span={8}>
                <Button onClick={this.queryStrategyForce}>
                  <Icon type="sync"/> 更新
                </Button>
              </Col>
            </Row>
          </PageHeader>
          <div className="content-card-wrap no-padding-top">
            <Tabs defaultActiveKey={this.state.tabKey} onChange={this.tabChangeHandler}>
              <TabPane tab="买" key="1">
                <FundList
                  dataSource={strategy.strategyListSlump}
                  tableLoading={strategy.tableLoading}
                  onDelete={this.tableDeleteHandler}
                />
              </TabPane>
              <TabPane tab="买2" key="3">
                <FundList
                  dataSource={strategy.strategyListBoom}
                  tableLoading={strategy.tableLoading}
                  onDelete={this.tableDeleteHandler}
                />
              </TabPane>
              <TabPane tab="我的" key="2">
                <MyFundList
                  dataSource={strategy.myStrategyList}
                  tableLoading={strategy.myTableLoading}
                />
              </TabPane>
            </Tabs>
          </div>
          {this.state.addModal && <AddModal {...modalProps}/>}
        </div>
      </DocumentTitle>
    );
  }
}


const mapStateToProps = state => {
  return {
    strategy: state.strategy
  }
};

const mapDispatchToProps = dispatch => ({
  //action在此为引入
  strategyActions: bindActionCreators(strategyActions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Strategy));
