/**
 * Created by xiaobxia on 2017/11/16.
 */
import React, {PureComponent} from 'react'
import {Alert} from 'antd';
import {withRouter} from 'react-router-dom'
import {consoleRender} from 'localUtil/consoleLog'
import Exception404 from 'localComponent/404'

class Route404 extends PureComponent {
  render() {
    consoleRender('Route404 render');
    return (
      <Exception404/>
    );
  }
}

export default withRouter(Route404);
