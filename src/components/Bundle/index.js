/**
 * Created by xiaobxia on 2017/9/21.
 */
import React, {Component} from 'react'

export default class Bundle extends Component {
  constructor(props) {
    super(props)
  }
  componentWillMount() {
    this.load(this.props)
  }

  componentWillUnmount() {
    console.log('Bundle 卸载');
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.load !== this.props.load) {
      this.load(nextProps)
    }
  }
  load = (props) => {
    this.setState({
      mod: null
    });
    props.load((mod) => {
      this.setState({
        mod: mod.default ? mod.default : mod
      })
    })
  };

  render() {
    //国际化不能再这里包，不然会引起组件频繁卸载和装载
    return this.state.mod ? this.props.children(this.state.mod) : null;
  }
}
