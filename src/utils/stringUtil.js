function getStringByte(str) {
  str = str || ''
  let len = 0
  for (let i = 0; i < str.length; i++) {
    if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
      len += 2
    } else {
      len++
    }
  }
  return len
}

export default {
  getStringByte,
  maxText(str, len) {
    // len是字节长度
    const strLen = getStringByte(str)
    if (str && strLen > len) {
      return str.substring(0, len - 3) + '...'
    } else {
      return str
    }
  },
  createBlankSpace(len) {
    len = len || 0
    let str = ''
    for (let i = 0; i < len; i++) {
      str += '&nbsp;'
    }
    return str
  }
}
