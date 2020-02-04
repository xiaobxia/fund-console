import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import urlUtil from './urlUtil'

let basePath = '/fundServer/'

// 默认连接地址，只在调试时有用
if (process.env.NODE_ENV === 'development') {
  basePath = `/${urlUtil.getQueryStringArgs('pt') || 'main'}${basePath}`
}

axios.interceptors.request.use(function(config) {
  config.headers.token = localStorage.getItem('token') || ''
  return config
}, function(error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(function(response) {
  if (response.data.status === false) {
    if (response.data.code === 401) {
      Message({
        message: response.data.message,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      Message({
        message: response.data.message,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(new Error(response.data.message))
  }
  return response
}, function(error) {
  Message({
    message: error.message,
    type: 'error',
    duration: 5 * 1000
  })
  console.log('interceptors error')
  return Promise.reject(error)
})

function makeUrl(url) {
  if (url.startsWith('/') || url.startsWith('http://') || url.startsWith('https://')) {
    return url
  } else {
    return `${basePath}${url}`
  }
}

const Http = {
  get(url, query, options) {
    let queryString = ''
    if (query) {
      query.timestamp = new Date().getTime()
    } else {
      query = { timestamp: new Date().getTime() }
    }
    queryString = qs.stringify(query)
    return axios.get(makeUrl(url + (queryString ? '?' + queryString : '')), options).then(data => data.data)
  },
  post(url, param, options) {
    return axios.post(makeUrl(url), param, options).then(data => data.data)
  },
  postJson(url, param, options) {
    param = param || {}
    return axios.post(makeUrl(url), qs.stringify(param), options).then(data => data.data)
  },
  makeUrl
}

export default Http
