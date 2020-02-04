const Mock = require('mockjs')

module.exports = [
  // mock get all routes form server
  {
    url: '/routes',
    type: 'get',
    response: () => {
      return {
        code: 200,
        data: {
          key: Mock.mock('@integer(300, 5000)')
        }
      }
    }
  }
]
