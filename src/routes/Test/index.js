/**
 * Created by xiaobxia on 2017/10/18.
 */
import React, {PureComponent} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {withRouter} from 'react-router-dom'
import { Input } from 'antd';
import qs from 'qs'
import HelloWord from 'localComponent/HelloWorld'
import {consoleRender} from 'localUtil/consoleLog'
import classNames from 'classnames'

class Test extends PureComponent {
  constructor(props) {
    super(props);
  }

  state = {
    type: 1,
    user: {name: 'xiaobxia'}
  };

  componentWillMount() {
    // console.log('将要装载Test');
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    console.log('将要卸载Test');
    // this.state.ws.close();
  }

  jumpToDashboard = () => {
    //路由跳转
    let query = qs.stringify({
      name: 'xiaobxia'
    });
    this.props.history.push('/dashboard?' + query);
  };

  changeName = () => {
    //react建议把state当做不可变
    this.setState((preState) => {
      //this.state和preState是相同的引用
      let user = preState.user;
      user.name = 'xiaobxia1';
      //是一种merge的行为
      return {
        user: user
      }
    });
  };

  render() {
    consoleRender('Test render');
    //query在search里
    let query = qs.parse(this.props.location.search.slice(1));
    return (
      <div className="module-test">
        <h1>TEST模块</h1>
        <div className="test-block">
          <h3>测试组件</h3>
          <HelloWord />
        </div>
        <div className="test-block">
          <h3>测试国际化</h3>
          <p>app的名字是: </p>
        </div>
        <div className="test-block">
          <h3>测试路由</h3>
          <div>
            <p>当前路由的query：{JSON.stringify(query)}</p>
            <button onClick={this.jumpToDashboard}>主页</button>
          </div>
        </div>
        <div className="test-block">
          <h3>原生html</h3>
          <div>
            <p dangerouslySetInnerHTML={{__html: '<p>我是一段原生html</p>'}}/>
          </div>
        </div>
        <div className="test-block">
          <h3>条件渲染</h3>
          <div>
            {this.state.type === 1 ? (<p>1</p>) : (<p>2</p>)}
          </div>
        </div>
        <div className="test-block">
          <h3 className={classNames({'one': true, 'two': false})}>classnames</h3>
        </div>
        <div className="test-block">
          <h3>修改state</h3>
          <div>
            <input type="text"/>
            <button onClick={this.changeName}>{this.state.user.name}</button>
          </div>
        </div>
      </div>
    );
  }
}


export default withRouter(connect()(Test));
