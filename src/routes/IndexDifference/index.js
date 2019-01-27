/**
 * Created by xiaobxia on 2018/1/25.
 */
import React, {PureComponent} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import DocumentTitle from 'react-document-title';
import {Input, Upload, message, Button, Icon, Row, Col, Radio} from 'antd';
import http from 'localUtil/httpUtil';
import numberUtil from 'localUtil/numberUtil';
import {consoleRender} from 'localUtil/consoleLog'
import PageHeader from 'localComponent/PageHeader'
import {getOpenKeyAndMainPath} from '../../router'
import IndexList from './indexList'


class IndexInfo extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    chuangye: [],
    wulin: [],
    list: []
  };

  componentWillMount() {
    this.initPage();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  initPage = () => {
    Promise.all([
      http.get(`webData/getStockAllDongfang`, {
        code: 'sz399006',
        days: 200
      }).then((data) => {
        if (data.success) {
          const list = data.data.list;
          this.setState({
            chuangye: list
          });
        }
      }),
      http.get(`webData/getStockAllDongfang`, {
        code: 'sh000016',
        days: 200
      }).then((data) => {
        if (data.success) {
          const list = data.data.list;
          this.setState({
            wulin: list
          });
        }
      })
    ]).then(() => {
      const wulin = this.state.wulin;
      const chuangye = this.state.chuangye;
      let temp = [];
      for (let i = 0; i < wulin.length; i++) {
        temp.push({
          date: wulin[i].date,
          wulin: wulin[i].kline.netChangeRatio,
          chuangye: chuangye[i].kline.netChangeRatio
        })
      }
      this.setState({
        list: temp
      });
    })
  };

  getTitle() {
    return getOpenKeyAndMainPath(this.props.location.pathname).title;
  }

  render() {
    consoleRender('IndexInfo render');
    const title = this.getTitle();
    return (
      <DocumentTitle title={title}>
        <div className="module-my-fund route-modules">
          <PageHeader routeTitle={title}>
          </PageHeader>
          <div className="content-card-wrap">
            <h3 className="blue-text">
            </h3>
            <IndexList
              dataSource={this.state.list}
              chuangye={this.state.chuangye}
              wulin={this.state.wulin}
            />
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default withRouter(IndexInfo);
