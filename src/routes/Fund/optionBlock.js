/**
 * Created by xiaobxia on 2018/2/23.
 */
import React, {PureComponent} from 'react'
import {Button, message} from 'antd';
import http from 'localUtil/httpUtil';

class OptionBlock extends PureComponent {
  state = {
    updateBaseInfoLoading: false,
    updateValuationLoading: false,
    betterValuationLoading: false
  };

  updateBaseInfoHandler = () => {
    this.setState({updateBaseInfoLoading: true});
    http.get('schedule/updateBaseInfo').then(() => {
      this.setState({updateBaseInfoLoading: false});
      message.success('成功');
    })
  };

  updateValuationHandler = () => {
    this.setState({updateValuationLoading: true});
    http.get('schedule/updateValuation').then(() => {
      this.setState({updateValuationLoading: false});
      message.success('成功');
    })
  };
  betterValuationHandler = () => {
    this.setState({betterValuationLoading: true});
    http.get('schedule/betterValuation').then(() => {
      this.setState({betterValuationLoading: false});
      message.success('成功');
    })
  };
  updateRateHandler = () => {
    http.get('schedule/updateRate').then(() => {
      message.success('成功');
    })
  };

  render() {
    const state = this.state;
    return (
      <Button.Group>
        <Button onClick={this.updateBaseInfoHandler} loading={state.updateBaseInfoLoading}>
          更新基金净值
        </Button>
        <Button onClick={this.betterValuationHandler} loading={state.betterValuationLoading}>
          更新估值源
        </Button>
        <Button onClick={this.updateValuationHandler} loading={state.updateValuationLoading}>
          更新基金估值
        </Button>
        <Button onClick={this.updateRateHandler}>
          更新基金涨跌幅
        </Button>
      </Button.Group>
    );
  }
}

export default OptionBlock;
