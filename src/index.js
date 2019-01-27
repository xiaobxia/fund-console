/**
 * Created by xiaobxia on 2017/10/17.
 */
import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import Nprogress from 'nprogress'
import {Modal} from 'antd';
import axios from 'axios';
import store from './store';
import App from './app'
// import Perf from 'react-addons-perf'
//生产环境移除
// window.Perf = Perf;
//Perf.start()
//Perf.stop()
//Perf.printInclusive()
//Perf.printWasted()  无意义渲染
//http拦截
axios.interceptors.request.use(function (config) {
  Nprogress.start();
  return config;
}, function (error) {
  return Promise.reject(error);
});
axios.interceptors.response.use(function (response) {
  Nprogress.done();
  let data = response.data;
  if (response.status === 0) {
    console.warn('[HTTP status=0]');
    return response;
  } else {
    //200
    if (data.status !== 0) {
      //有错误
      switch (data.status) {
        case 'USER_SESSION_TIMEOUT':
          store.dispatch({type: 'APP_SHOW_GLOB_LOGIN'});
          break;
      }
    }
    return response;
  }
}, function (error) {
  Nprogress.done();
  console.log('http in error');
  let response = error.response;
  const {errorCode, errorMessage} = response.data || {};
  let errorMsg = 'Server Internal Error. Please contact Administrator!';
  if (errorMessage) {
    errorMsg = `${errorMessage}`;
  }
  console.log(errorCode, errorMsg);
  const msg = `${response.status} ${response.statusText}; \r\n${errorMsg}`;
  Modal.error({
    title: 'This is an error message',
    content: msg
  });
  // Do something with response error
  return Promise.reject(error);
});
ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);
