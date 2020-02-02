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
import indexInfoUtil from 'localUtil/indexInfoUtilXiong';
import {consoleRender} from 'localUtil/consoleLog'
import PageHeader from 'localComponent/PageHeader'
import {getOpenKeyAndMainPath} from '../../router'
import IndexList from './indexList'
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const codeMap = indexInfoUtil.codeMap;
const formatData = indexInfoUtil.formatData;
let codeList = [];
codeMap['baijiu'] = {
  code: 'sz399997',
  name: '白酒',
  mix: false,
  key: 'baijiu',
  threshold: 1.21,
  rate: 1.07016,
  wave: 1.3559459459459462,
  days: 1200
}
for (let key in codeMap) {
  codeList.push({
    code: codeMap[key].code,
    key: key,
    name: codeMap[key].name
  })
}

const defaultIndex = 'chuangye'
const ifMock = false
const ifLockData = true

class IndexInfo extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    list: [],
    threshold: 0,
    rate: 0,
    wave: 0,
    average: 0,
    nowType: defaultIndex
  };

  componentWillMount() {
    this.initPage();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  initPage = (code, index) => {
    //webData/getStockAllDongfang
    code = code || codeMap[defaultIndex].code;
    const days = codeMap[index || defaultIndex].days || 750;
    http.get(`${ifMock ? '/mock' : 'stock'}/getStockAllDongfang`, {
      code: code,
      days
    }).then((data) => {
      if (data.success) {
        const list = data.data.list;
        if (ifLockData) {
          this.setState({
            list: formatData(list).list
          });
          this.setState({
            threshold: codeMap[index || defaultIndex].threshold,
            rate: codeMap[index || defaultIndex].rate,
            wave: codeMap[index || defaultIndex].wave,
            average: codeMap[index || defaultIndex].average
          });
        } else {
          this.setState(formatData(list));
        }
      }
    })
  };

  getTitle() {
    return getOpenKeyAndMainPath(this.props.location.pathname).title;
  }

  onChange=(e) => {
    let code = {};
    for (let key in codeMap) {
      code[key] = codeMap[key].code
    }
    this.setState({nowType: e.target.value});
    this.initPage(code[e.target.value], e.target.value);
    console.log(e.target.value)
  };

  render() {
    consoleRender('IndexInfo render');
    const title = this.getTitle();
    return (
      <DocumentTitle title={title}>
        <div className="module-my-fund route-modules">
          <PageHeader routeTitle={title}>
            <Row className="page-header-content">
            <RadioGroup onChange={this.onChange} defaultValue={defaultIndex}>
              {codeList.map((item) => {
                return <RadioButton key={item.key} value={item.key}>{item.name}</RadioButton>
              })}
            </RadioGroup>
            </Row>
          </PageHeader>
          <div className="content-card-wrap">
            <h3 className="blue-text">
              <p>在疯狂过后，只有跌回年线一下，才可以继续交易</p>
            </h3>
            <IndexList
              dataSource={this.state.list}
              nowType={this.state.nowType}
              threshold={this.state.threshold}
              rate={this.state.rate}
              wave={this.state.wave}
              average={this.state.average}
            />
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default withRouter(IndexInfo);
