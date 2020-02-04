function formatNum(str) {
  var newStr = ''
  var count = 0
  let startCode = ''
  if (str.charAt(0) === '-') {
    str = str.slice(1)
    startCode = '-'
  }
  // 当数字是整数
  if (str.indexOf('.') === -1) {
    for (let i = str.length - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr
      }
      count++
    }
    str = newStr + '.00' // 自动补小数点后两位
    return str
  } else {
    for (let i = str.indexOf('.') - 1; i >= 0; i--) {
      if (count % 3 === 0 && count !== 0) {
        newStr = str.charAt(i) + ',' + newStr
      } else {
        newStr = str.charAt(i) + newStr // 逐个字符相接起来
      }
      count++
    }
    str = newStr + (str + '00').substr((str + '00').indexOf('.'), 3)
    return startCode + str
  }
}
const numberUtil = {
  countRate: function(numerator, denominator) {
    denominator = denominator || 1
    return Math.round(10000 * (numerator / denominator)) / 100
  },
  countDifferenceRate: function(numerator, denominator) {
    denominator = denominator || 1
    numerator = numerator || 1
    return Math.round(1000000 * ((numerator - denominator) / denominator)) / 10000
  },
  keepTwoDecimals: function(number) {
    return Math.round(100 * number) / 100
  },
  toTwoDecimals: function(number) {
    let newNumber = parseFloat(number)
    if (isNaN(newNumber)) {
      newNumber = 0
    }
    return newNumber.toFixed(2)
  },
  keepFourDecimals: function(number) {
    return Math.round(10000 * number) / 10000
  },
  ifAround: function(number, target) {
    const step = 100
    return (number >= (target - step)) && (number <= (target + step))
  },
  formatMoney(number) {
    return formatNum(this.toTwoDecimals(number))
  }
}

export default numberUtil
