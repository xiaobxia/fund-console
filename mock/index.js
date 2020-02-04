const Mock = require('mockjs')

const role = require('./api/role')

const mocks = [
  ...role
]

// for mock server
const responseFake = (url, type, respond) => {
  return {
    url: new RegExp(`/mock${url}`),
    type: type || 'get',
    response(req, res) {
      res.json(Mock.mock(respond instanceof Function ? respond(req, res) : respond))
    }
  }
}

module.exports = mocks.map(route => {
  return responseFake(route.url, route.type, route.response)
})
