const fs = require('fs-extra');

module.exports = [
  // mock get all routes form server
  {
    url: '/stockKline',
    type: 'get',
    response: (req, res) => {
      const query = req.query
      const hasRaw = fs.readJsonSync(`./mock/stockCreate/res/${query.key}.json`)
      return {
        code: 200,
        data: {
          ...hasRaw
        }
      }
    }
  },
  {
    url: '/upStockKlineAy',
    type: 'post',
    response: (req, res) => {
      const query = req.body
      console.log(query);
      return {
        code: 200,
        data: {
        }
      }
    }
  }
]
