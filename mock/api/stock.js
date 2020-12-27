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
  }
]
