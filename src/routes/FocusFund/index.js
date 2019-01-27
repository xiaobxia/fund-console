/**
 * Created by xiaobxia on 2018/2/8.
 */
import React, {PureComponent} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import DocumentTitle from 'react-document-title';
import {Input, Upload, message, Button, Icon, Row, Col, Tabs} from 'antd';
import {focusFundActions} from 'localStore/actions'
import {consoleRender} from 'localUtil/consoleLog'
import PageHeader from 'localComponent/PageHeader'
import {getOpenKeyAndMainPath} from '../../router'
import http from 'localUtil/httpUtil';
import FundList from './fundList'
import qs from 'qs'
import AddModal from './addModal'

class FocusFund extends PureComponent {
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
    this.props.focusFundActions.initStore();
    console.log('将要卸载FocusFund');
  }

  initPage = () => {
    this.props.focusFundActions.queryFocusFunds();
  };

  // 删除基金
  tableDeleteHandler = (code) => {
    http.get('focusFund/deleteFocusFund', {code}).then((data) => {
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
      action: http.generateUrl('upload/importFocusFund'),
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
    return http.post('focusFund/addFocusFund', {code}).then((data) => {
      if (data.success) {
        this.initPage();
      }
      return data;
    });
  };

  render() {
    consoleRender('FocusFund render');
    const title = this.getTitle();
    const focusFund = this.props.focusFund;
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
              dataSource={focusFund.focusFundList}
              tableLoading={focusFund.tableLoading}
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
    focusFund: state.focusFund
  }
};

const mapDispatchToProps = dispatch => ({
  //action在此为引入
  focusFundActions: bindActionCreators(focusFundActions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(FocusFund));
