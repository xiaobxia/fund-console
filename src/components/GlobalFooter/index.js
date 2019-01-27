import React, {PureComponent} from 'react'
import {Icon} from 'antd';

class GlobalFooter extends PureComponent {
  render() {
    return (
      <div className="global-footer">
        <p>Copyright <Icon type="copyright" /> 2018 xiaobxia出品</p>
      </div>
    );
  }
}


export default GlobalFooter;

