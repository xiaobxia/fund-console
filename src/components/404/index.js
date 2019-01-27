/**
 * Created by xiaobxia on 2017/11/16.
 */
import React, {PureComponent} from 'react'
import {Alert} from 'antd';
import {consoleRender} from 'localUtil/consoleLog'
import img404 from '../../../static/404.png'

class Exception404 extends PureComponent {
  render() {
    consoleRender('Exception404 render');
    return (
      <img src={img404} alt=""/>
    );
  }
}

export default Exception404;
