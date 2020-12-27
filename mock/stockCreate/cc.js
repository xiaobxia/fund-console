const axios = require('axios');
const fs = require('fs-extra');
const indexList = require('./indexList')

function parseNumber(text) {
  text = text || ''
  return parseFloat(text || 0) || 0
}

function formatData(str) {
  const data = str.split(',')
  return {
    close: parseNumber(data[2]),
    high: parseNumber(data[3]),
    low: parseNumber(data[4]),
    netChangeRatio: parseNumber(data[7]),
    open: parseNumber(data[1]),
    // 没有数据
    preClose: parseNumber(data[1]),
    tradeTime: data[0]
  }
}

function logHas(list, key) {
  const fileName = `./res/${key}.json`;
  return fs.ensureFile(fileName).then(() => {
    return fs.writeJson(fileName, list)
  });
}

function formatDongfangCode(code) {
  let codeId = ''
  if (code.indexOf('sh') !== -1) {
    codeId = '1.' + code.substring(2)
  } else if (code.indexOf('sz') !== -1) {
    codeId = '0.' + code.substring(2)
  }
  return codeId
}


function qudata(key ,code) {
  axios({
    method: 'get',
    url: `http://push2his.eastmoney.com/api/qt/stock/kline/get?cb=jQuery1124045287753765423266_1609041231544&secid=${formatDongfangCode(code)}&ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58&klt=101&fqt=0&beg=19900101&end=20220101&_=1609041231568`,
    headers: {
    }
  }).then((res) => {
    let str = res.data.slice(res.data.indexOf('(') + 1, res.data.lastIndexOf(')'))
    console.log(str)
    let list = JSON.parse(str).data.klines
    const newList = []
    list.forEach((v)=>{
      newList.push(formatData(v))
    })
    newList.forEach((v, index)=>{
      if (index > 0) {
        v.preClose = newList[index -1].close
      }
    })
    logHas({
      newList
    }, key)
  })
}


let count = 0
// console.log(indexList[count])
// const item = indexList[count]
// qudata(item.key, item.code)
const timer = setInterval(()=>{
  const item = indexList[count]
  if (item) {
    qudata(item.key, item.code)
    count++
  } else {
    clearInterval(timer)
  }
}, 1000 * 10)


