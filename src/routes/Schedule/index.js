/**
 * Created by xiaobxia on 2018/2/8.
 */
import React, {PureComponent} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import DocumentTitle from 'react-document-title';
import {Input, Upload, message, Button, Icon, Row, Col, List, Switch} from 'antd';
import {scheduleActions} from 'localStore/actions'
import {consoleRender} from 'localUtil/consoleLog'
import PageHeader from 'localComponent/PageHeader'
import {getOpenKeyAndMainPath} from '../../router'
import http from 'localUtil/httpUtil';
import qs from 'qs'
import AddModal from './addModal'

class Schedule extends PureComponent {
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
    this.props.scheduleActions.initStore();
    console.log('将要卸载Schedule');
  }

  initPage = () => {
    this.props.scheduleActions.querySchedules();
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

  addSchedule = (data) => {
    return http.post('schedule/add', {...data}).then((data) => {
      if (data.success) {
        this.initPage();
      }
      return data;
    });
  };

  onChangeHandler = (name) => {
    return (checked) => {
      http.post('schedule/changeStatus', {name, open: checked ? 'open' : 'close'}).then((data) => {
        if (data.success) {
          this.initPage();
        }
        return data;
      });
    };
  };

  render() {
    consoleRender('Schedule render');
    const title = this.getTitle();
    const schedule = this.props.schedule;
    const modalProps = {
      onClose: this.closeModalHandler,
      onAdd: this.addSchedule
    };
    return (
      <DocumentTitle title={title}>
        <div className="module-my-fund route-modules">
          <PageHeader routeTitle={title}>
          </PageHeader>
          <div className="content-card-wrap">
            <List
              bordered
              dataSource={schedule.scheduleList}
              renderItem={(item) => {
                return (<List.Item>
                  <span>{item.describe}</span>
                  <span style={{marginLeft: 50}}>
                    <Switch
                      checked={item.open === 'open'}
                      onChange={this.onChangeHandler(item.name)}
                    />
                  </span>
                </List.Item>)
              }}
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
    schedule: state.schedule
  }
};

const mapDispatchToProps = dispatch => ({
  //action在此为引入
  scheduleActions: bindActionCreators(scheduleActions, dispatch)
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Schedule));
