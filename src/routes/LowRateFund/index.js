/**
 * Created by xiaobxia on 2018/2/8.
 */
import React, {PureComponent} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import DocumentTitle from 'react-document-title';
import {Input, Upload, message, Button, Icon, Row, Col, Tabs} from 'antd';
import {lowRateFundActions} from 'localStore/actions'
import {consoleRender} from 'localUtil/consoleLog'
import PageHeader from 'localComponent/PageHeader'
import {getOpenKeyAndMainPath} from '../../router'
import http from 'localUtil/httpUtil';
import FundList from './fundList'
import qs from 'qs'
import AddModal from './addModal'

class LowRateFund extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    updateLoading: false,
    addModal: false
  };

  componentWillMount() {
    this.initPage();
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.props.lowRateFundActions.initStore();
    console.log('将要卸载LowRateFund');
  }

  initPage = () => {
    this.props.lowRateFundActions.queryLowRateFunds();
  };

  // 删除基金
  tableDeleteHandler = (code) => {
    http.get('lowRateFund/deleteLowRateFund', {code}).then((data) => {
      if (data.success) {
        message.success('取消成功');
      } else {
        message.error('取消失败');
      }
      this.initPage();
    })
  };

  getTitle() {
    return getOpenKeyAndMainPath(this.props.location.pathname).title;
  }

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


  // 上传
  getUploadProps = () => {
    const initPage = this.initPage;
    return {
      name: 'fundFile',
      action: http.generateUrl('upload/importLowRateFund'),
      headers: {
        token: window._token
      },
      onChange(info) {
        if (info.file.status === 'done') {
          if (info.file.response.success) {
            if (info.file.response.data) {
              message.warn(`有${info.file.response.data.failList.length}项失败`);
            } else {
              message.success('导入成功');
            }
            initPage();
          } else {
            message.error(info.file.response.message);
          }
        } else if (info.file.status === 'error') {
          message.error('导入失败');
        }
      }
    };
  };

  addFund = (code) => {
    return http.post('lowRateFund/addLowRateFund', {code}).then((data) => {
      if (data.success) {
        this.initPage();
      }
      return data;
    });
  };

  render() {
    consoleRender('LowRateFund render');
    const title = this.getTitle();
    const lowRateFund = this.props.lowRateFund;
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
                <Upload {...this.getUploadProps()}>
                  <Button>
                    <Icon type="upload"/> 导入我的关注
                  </Button>
                </Upload>
              </Col>
              <Col span={8}>
              </Col>
              <Col span={8} style={{textAlign: 'right'}}>
                <Button.Group>
                  <Button onClick={this.openModalHandler}>
                    添加关注
                  </Button>
                </Button.Group>
              </Col>
            </Row>
          </PageHeader>
          <div className="content-card-wrap">
            <FundList
              dataSource={lowRateFund.lowRateFundList}
              tableLoading={lowRateFund.tableLoading}
              onDelete={this.tableDeleteHandler}
            />
          </div>
          {this.state.addModal && <AddModal {...modalProps}/>}
        </div>
      </DocumentTitle>
    );
  }
}


const mapStateToProps = state => {
  return {
    lowRateFund: state.lowRateFund
  }
};

const mapDispatchToProps = dispatch => ({
  //action在此为引入
  lowRateFundActions: bindActionCreators(lowRateFundActions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LowRateFund));
