/**
 * Created by xiaobxia on 2018/6/28.
 */
import numberUtil from './numberUtil'

function ifMatch(raw, target) {
  let match = true
  for (let key in target) {
    if (target[key] !== raw[key]) {
      match = false
      break
    }
  }
  return match
}

function extend(raw, target) {
  let obj = {}
  for (let key in raw) {
    obj[key] = raw[key]
  }
  for (let key in target) {
    obj[key] = target[key]
  }
  return obj
}

function Util(config) {
  this.threshold = config.threshold
  this.rate = config.rate
  this.wave = config.wave
}

Util.prototype = {
  getFlag: function (record) {
    let flag = {}
    flag.ifUpOpen = this.ifUpOpen(record)
    flag.ifOpenHigh = this.ifOpenHigh(record)
    flag.ifUpClose = this.ifUpClose(record)
    flag.ifCloseHigh = this.ifCloseHigh(record)
    flag.ifSessionDown = this.ifSessionDown(record)
    flag.ifSessionUpClose = this.ifSessionUpClose(record)
    flag.ifSessionUp = this.ifSessionUp(record)
    flag.ifSessionDownClose = this.ifSessionDownClose(record)
    flag.ifHighPreCloseDown = this.ifHighPreCloseDown(record)
    return flag
  },
  //是否高开
  ifUpOpen: function (record) {
    const preClose = record.preClose
    const open = record.open
    return open >= preClose
  },
  //是否开盘高幅度
  ifOpenHigh: function (record) {
    const rate = this.rate
    const preClose = record.preClose
    const open = record.open
    return Math.abs(numberUtil.countDifferenceRate(open, preClose)) >= rate
  },
  //是否上涨
  ifUpClose: function (record) {
    return record.netChangeRatio > 0
  },
  // 是否大幅上涨
  ifCloseHigh: function (record) {
    const rate = this.rate
    return Math.abs(record.netChangeRatio) >= rate
  },
  // 盘中下跌
  ifSessionDown: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.low, record.preClose) <= -wave
  },
  // 收盘拉起
  ifSessionUpClose: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.close, record.low) >= wave
  },
  // 盘中上升
  ifSessionUp: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.high, record.preClose) >= wave
  },
  // 收盘回落
  ifSessionDownClose: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.close, record.high) <= -wave
  },
  // 无抵抗下跌
  ifHighPreCloseDown: function (record) {
    const rate = this.rate
    return numberUtil.countDifferenceRate(record.high, record.preClose) < -rate
  },
  ifChuangye: function (record, oneDayRecord) {
    const today = this.getFlag(record)

    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifGangtie: function (record, oneDayRecord) {
    const today = this.getFlag(record)

    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifJungong: function (record, oneDayRecord) {
    const today = this.getFlag(record)

    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifYiyao: function (record, oneDayRecord) {
    const today = this.getFlag(record)

    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifMeitan: function (record, oneDayRecord) {
    const today = this.getFlag(record)

    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifYouse: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifJisuanji: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifBaijiu: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifXinxi: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifXiaofei: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifBaoxian: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifWulin: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifChuanmei: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifDianzi: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifYiliao: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifShengwu: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifSanbai: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifWubai: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifYinhang: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifDichan: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifZhengquan: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifJijian: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  },
  ifQiche: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownClose': false}
    )) {
      return {
        flag: true,
        text: 'type-3-0'
      }
    }
    return false
  }
}

const codeMap = {
  'chuangye': {
    code: 'sz399006',
    name: '创业',
    threshold: 0.99,
    wave: 0.99,
    rate: 0.99
  },
  'gangtie': {
    code: 'sz399440',
    name: '钢铁',
    threshold: 0.88,
    wave: 0.88,
    rate: 0.875
  },
  'jungong': {
    code: 'sz399959',
    name: '军工',
    threshold: 0.97,
    wave: 1.0298226950354608,
    rate: 0.903150684931507
  },
  'yiyao': {
    code: 'sh000037',
    name: '医药',
    threshold: 0.94,
    rate: 0.9339416058394158,
    wave: 0.9391726618705037
  },
  'meitan': {
    code: 'sz399998',
    name: '煤炭',
    threshold: 0.81,
    wave: 0.8196071428571425,
    rate: 0.800408163265306
  },
  'youse': {
    code: 'sh000823',
    name: '有色',
    threshold: 0.92,
    wave: 0.8558865248226952,
    rate: 0.9762650602409638
  },
  'jisuanji': {
    code: 'sz399363',
    name: '计算机',
    threshold: 1.04,
    rate: 0.9923308270676693,
    wave: 1.0808712121212116
  },
  'baijiu': {
    code: 'sz399997',
    name: '白酒',
    threshold: 1.19,
    rate: 1.0296610169491525,
    wave: 1.3582478632478634
  },
  'xinxi': {
    code: 'sh000993',
    name: '信息',
    threshold: 1.04,
    rate: 1.074,
    wave: 1.0134768211920533
  },
  'xiaofei': {
    code: 'sh000990',
    name: '消费',
    threshold: 0.97,
    rate: 0.9892814371257483,
    wave: 0.9413607594936705
  },
  'baoxian': {
    code: 'sz399809',
    name: '保险',
    threshold: 0.99,
    wave: 1.0300986842105262,
    rate: 0.9583561643835617
  },
  'wulin': {
    code: 'sh000016',
    name: '50',
    threshold: 0.75,
    rate: 0.7405555555555559,
    wave: 0.7563749999999999
  },
  'chuanmei': {
    code: 'sz399971',
    name: '传媒',
    threshold: 0.88,
    rate: 0.8535099337748346,
    wave: 0.9043518518518522
  },
  'dianzi': {
    code: 'sz399811',
    name: '电子',
    threshold: 0.94,
    rate: 0.8853900709219857,
    wave: 1.0019867549668875
  },
  'yiliao': {
    code: 'sz399989',
    name: '医疗',
    threshold: 1.03,
    wave: 1.125688405797102,
    rate: 0.9364748201438846
  },
  'shengwu': {
    code: 'sz399441',
    name: '生物',
    threshold: 0.9,
    rate: 0.8244117647058824,
    wave: 0.9843464052287579
  },
  'sanbai': {
    code: 'sh000300',
    name: '300',
    threshold: 0.71,
    rate: 0.681153846153846,
    wave: 0.73984375
  },
  'wubai': {
    code: 'sh000905',
    name: '500',
    threshold: 0.77,
    wave: 0.7210576923076923,
    rate: 0.8220000000000003
  },
  'yinhang': {
    code: 'sz399986',
    name: '银行',
    threshold: 0.69,
    rate: 0.6740372670807456,
    wave: 0.7059375
  },
  'dichan': {
    code: 'sz399393',
    name: '地产',
    threshold: 0.95,
    rate: 0.932594936708861,
    wave: 0.9707741935483872
  },
  'zhengquan': {
    code: 'sz399437',
    name: '证券',
    threshold: 0.86,
    rate: 0.8506493506493509,
    wave: 0.8617586206896549
  },
  'jijian': {
    code: 'sz399995',
    name: '基建',
    threshold: 0.6,
    rate: 0.5599350649350648,
    wave: 0.6321472392638036
  },
  'qiche': {
    code: 'sz399432',
    name: '汽车',
    threshold: 0.61,
    rate: 0.5677702702702703,
    wave: 0.6542647058823531
  }
}
const fnMap = {
  chuangye: 'ifChuangye',
  gangtie: 'ifGangtie',
  jungong: 'ifJungong',
  yiyao: 'ifYiyao',
  meitan: 'ifMeitan',
  youse: 'ifYouse',
  jisuanji: 'ifJisuanji',
  baijiu: 'ifBaijiu',
  xinxi: 'ifXinxi',
  xiaofei: 'ifXiaofei',
  baoxian: 'ifBaoxian',
  wulin: 'ifWulin',
  chuanmei: 'ifChuanmei',
  dianzi: 'ifDianzi',
  yiliao: 'ifYiliao',
  shengwu: 'ifShengwu',
  sanbai: 'ifSanbai',
  wubai: 'ifWubai',
  yinhang: 'ifYinhang',
  dichan: 'ifDichan',
  zhengquan: 'ifZhengquan',
  jijian: 'ifJijian',
  qiche: 'ifQiche'
}

const changeMarket = {
  Util,
  codeMap,
  fnMap,
  formatData: function (list) {
    let listTemp = []
    for (let i = 0; i < list.length; i++) {
      listTemp.push({
        date: '' + list[i].date,
        ...list[i].kline
      })
    }
    let xData = []
    for (let j = 0; j < 7; j = j + 0.1) {
      xData.push({
        number: j.toFixed(1),
        count: 0,
        countList: [],
        count2: 0,
        countList2: []
      });
    }
    list.forEach((item, index) => {
      let value = Math.abs(numberUtil.countDifferenceRate(item.kline.close, item.kline.preClose));
      let value2 = Math.abs(numberUtil.countDifferenceRate(item.kline.high, item.kline.low));
      for (let i = 0; i < xData.length; i++) {
        if (value >= xData[i].number && xData[i + 1] && value < xData[i + 1].number) {
          xData[i].count++
          xData[i].countList.push(value)
          break
        }
      }
      for (let j = 0; j < xData.length; j++) {
        if (value2 >= xData[j].number && xData[j + 1] && value2 < xData[j + 1].number) {
          xData[j].count2++
          xData[j].countList2.push(value2)
          break
        }
      }
    });
    let all = 0
    let count = 0
    let all2 = 0
    let count2 = 0
    for (let k = 0; k < xData.length; k++) {
      if (xData[k].count >= 5) {
        count = count + xData[k].count;
        for (let c = 0; c < xData[k].countList.length; c++) {
          all = all + xData[k].countList[c]
        }
      }
      if (xData[k].count2 >= 5) {
        count2 = count2 + xData[k].count2;
        for (let b = 0; b < xData[k].countList2.length; b++) {
          all2 = all2 + xData[k].countList2[b]
        }
      }
    }
    xData.sort((a, b) => {
      return b.count2 - a.count2
    })
    console.log(xData)
    let a = (all2 / count2) / 2
    let c = all / count
    let threshold = numberUtil.keepTwoDecimals((a + c) / 2)
    console.log(count)
    console.log(count2)
    console.log('wave:  ' + a)
    console.log('rate:  ' + c)
    console.log(threshold)
    return {list: listTemp, threshold: threshold, rate: c, wave: a}
  }
}

export default changeMarket
