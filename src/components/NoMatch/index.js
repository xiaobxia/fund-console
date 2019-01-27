/**
 * Created by xiaobxia on 2017/10/22.
 */
import React from 'react'
import {Alert} from 'antd';
import {injectIntl} from 'react-intl';
const NoMatch = (props) => {
  return (
    <Alert
      message="404"
      description={props.intl.formatMessage({id: 'App.noMatch'})}
      type="warning"
      showIcon
    />
  );
};
export default injectIntl(NoMatch);
