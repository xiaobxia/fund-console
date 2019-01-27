/**
 * Created by xiaobxia on 2017/9/13.
 */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
//import {connect} from 'react-redux'


class HelloWord extends Component {
  //父组件传递给它的
  //默认的props
  static defaultProps = {
    icon: 'delete'
  };

  state = {
    time: new Date(),
    count: 0
  };

  addCount = () => {

    this.setState((preState) => {
      this.props.onChange(preState.count + 1);
      return {
        count: preState.count + 1
      }
    });
  };


  render() {
    //局部的类似于vue中的data
    let {time, count} = this.state;
    //父组件传递给它的
    let {name, icon} = this.props;
    //console.log(this.props)
    return (
      <div>
        <h3>时间{time.toDateString()}</h3>
        <p>计数{count}</p>
        <p>名字{name}</p>
        <p>icon{icon}</p>
      </div>
    );
  }
}

HelloWord.propTypes = {
  //字符串
  type: PropTypes.string,
  //元素或字符串
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  //布尔
  disabled: PropTypes.bool,
  //数字
  maxLength: PropTypes.number,
  //任何
  defaultValue: PropTypes.any,
  //其中之一
  size: PropTypes.oneOf(['large', 'small', 'mini']),
  //html节点
  prepend: PropTypes.node,
  //对象
  autosize: PropTypes.object,
  //函数
  onFocus: PropTypes.func
};
export default HelloWord;

//TODO 有了connect，就可以省去dispatch，
// export default connect(
// );
