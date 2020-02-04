/**
 * Created by xiaobxia on 2018/6/28.
 */
import numberUtil from './numberUtil'

function ifMatch (raw, target) {
  let match = true
  for (let key in target) {
    if (target[key] !== raw[key]) {
      match = false
      break
    }
  }
  return match
}

function Util (config) {
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
    flag.ifCloseHigh2 = this.ifCloseHigh2(record)
    flag.ifSessionDown = this.ifSessionDown(record)
    flag.ifSessionDownHigh = this.ifSessionDownHigh(record)
    flag.ifSessionUpClose = this.ifSessionUpClose(record)
    flag.ifSessionUpCloseHigh = this.ifSessionUpCloseHigh(record)
    flag.ifSessionUp = this.ifSessionUp(record)
    flag.ifSessionUpHigh = this.ifSessionUpHigh(record)
    flag.ifSessionDownClose = this.ifSessionDownClose(record)
    flag.ifSessionDownCloseHigh = this.ifSessionDownCloseHigh(record)
    flag.ifHighPreCloseDown = this.ifHighPreCloseDown(record)
    flag.ifHighPreCloseDownHigh = this.ifHighPreCloseDownHigh(record)
    return flag
  },
  // 是否高开
  ifUpOpen: function (record) {
    const preClose = record.preClose
    const open = record.open
    return open >= preClose
  },
  // 是否开盘高幅度
  ifOpenHigh: function (record) {
    const rate = this.rate
    const preClose = record.preClose
    const open = record.open
    return Math.abs(numberUtil.countDifferenceRate(open, preClose)) >= rate
  },
  // 是否上涨
  ifUpClose: function (record) {
    return record.netChangeRatio > 0
  },
  // 是否大幅上涨
  ifCloseHigh: function (record) {
    const rate = this.rate
    return Math.abs(record.netChangeRatio) >= rate
  },
  ifCloseHigh2: function (record) {
    const rate = this.rate
    // return Math.abs(record.netChangeRatio) >= 2.25 * rate && Math.abs(record.netChangeRatio) <= 2.5 * rate
    return Math.abs(record.netChangeRatio) >= (2 * rate)
  },
  // 盘中下跌
  ifSessionDown: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.low, record.preClose) <= -wave
  },
  // 盘中大幅下跌
  ifSessionDownHigh: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.low, record.preClose) <= -(2 * wave)
  },
  // 收盘拉起
  ifSessionUpClose: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.close, record.low) >= wave
  },
  // 收盘大幅拉起
  ifSessionUpCloseHigh: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.close, record.low) >= (2 * wave)
  },
  // 盘中上升
  ifSessionUp: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.high, record.preClose) >= wave
  },
  // 盘中大幅上升
  ifSessionUpHigh: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.high, record.preClose) >= (2 * wave)
  },
  // 收盘回落
  ifSessionDownClose: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.close, record.high) <= -wave
  },
  // 收盘大幅回落
  ifSessionDownCloseHigh: function (record) {
    const wave = this.wave
    return numberUtil.countDifferenceRate(record.close, record.high) <= -(2 * wave)
  },
  // 无抵抗下跌
  ifHighPreCloseDown: function (record) {
    const rate = this.rate
    return numberUtil.countDifferenceRate(record.high, record.preClose) < -rate
  },
  // 大幅无抵抗下跌
  ifHighPreCloseDownHigh: function (record) {
    const rate = this.rate
    return numberUtil.countDifferenceRate(record.high, record.preClose) < -(2 * rate)
  },
  ifSellChuangye: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today, {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false})) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today, {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false})) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today, {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false})) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today, {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false})) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today, {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false})) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today, {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false})) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today, {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false})) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today, {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false})) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-20-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-21-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-22-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-23-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-24-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-25-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-26-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-27-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-28-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-29-0'
      }
    }
    return false
  },
  ifBuyChuangye: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    // 无抵抗下跌的都要
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpClose': true}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-15-0'
      }
    }
    return false
  },
  ifBuyGangtie: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-0-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-0-1'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true, 'ifHighPreCloseDown': true, 'ifHighPreCloseDownHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-3-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true, 'ifHighPreCloseDown': true, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-5-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-5-1'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-15-0'
      }
    }
    return false
  },
  ifSellGangtie: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-20-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-21-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-22-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-23-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-24-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-25-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-26-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-27-0'
      }
    }
    return false
  },
  ifBuyJungong: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false, 'ifHighPreCloseDown': false, 'ifHighPreCloseDownHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-2-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-4-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-5-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-6-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-6-1'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-9-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-17-0'
      }
    }
    return false
  },
  ifSellJungong: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-20-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-21-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-22-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-23-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-24-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-25-0'
      }
    }
    return false
  },
  ifBuyYiyao: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'buy-0-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-2-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-3-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-3-1'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-3-2'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-3-3'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'buy-3-4'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'buy-4-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-5-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-6-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-7-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-9-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-10-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-12-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpClose': true}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-18-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-19-0'
      }
    }
    return false
  },
  ifSellYiyao: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-20-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-21-0'
      }
    }
    return false
  },
  ifBuyMeitan: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'buy-1-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-2-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-17-0'
      }
    }
    return false
  },
  ifSellMeitan: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-20-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-21-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-22-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-23-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-24-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-25-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-26-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-27-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-28-0'
      }
    }
    return false
  },
  ifBuyYouse: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-2-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-17-0'
      }
    }
    return false
  },
  ifSellYouse: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'sell-14-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'sell-15-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-20-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-21-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-22-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-23-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-24-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-25-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-26-0'
      }
    }
    return false
  },
  ifBuyJisuanji: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'buy-1-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-6-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'buy-6-1'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-6-2'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-20-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-21-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-22-0'
      }
    }
    return false
  },
  ifSellJisuanji: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-20-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-21-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-22-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-23-0'
      }
    }
    return false
  },
  ifBuyXinxi: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-0-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-0-1'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-0-2'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-19-0'
      }
    }
    return false
  },
  ifSellXinxi: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-20-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-21-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-22-0'
      }
    }
    return false
  },
  ifBuyShipin: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {ifHighPreCloseDown: true, ifHighPreCloseDownHigh: true}
    )) {
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {ifHighPreCloseDown: true}
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    return false
  },
  ifSellShipin: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    return false
  },
  ifBuyBaoxian: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-7-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-7-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-8-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-8-1'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-14-0'
      }
    }
    return false
  },
  ifSellBaoxian: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-20-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-21-0'
      }
    }
    return false
  },
  ifBuyWulin: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-8-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-8-1'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-14-0'
      }
    }
    return false
  },
  ifSellWulin: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    return false
  },
  ifBuyChuanmei: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {ifHighPreCloseDown: true, ifHighPreCloseDownHigh: true}
    )) {
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-4-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-4-1'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-4-2'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    return false
  },
  ifSellChuanmei: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    return false
  },
  ifBuyDianzi: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-0-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'buy-0-1'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-0-2'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-0-3'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-0-4'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-1-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-8-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-18-0'
      }
    }
    return false
  },
  ifSellDianzi: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    return false
  },
  ifBuyYiliao: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true, 'ifHighPreCloseDown': false}
    )) {
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'buy-8-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-8-1'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-8-2'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-9-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-11-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-11-1'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-11-2'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-20-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: false
        }
      }
      return {
        flag: true,
        text: 'buy-21-0'
      }
    }
    return false
  },
  ifSellYiliao: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'sell-9-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'sell-9-1'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-20-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-21-0'
      }
    }
    return false
  },
  ifBuyShengwu: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'buy-3-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'buy-4-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-5-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-5-1'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-5-2'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-7-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-7-1'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'buy-7-2'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-7-3'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-19-0'
      }
    }
    return false
  },
  ifSellShengwu: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-20-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-21-0'
      }
    }
    return false
  },
  ifBuySanbai: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-1-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-1-1'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-12-0'
      }
    }
    return false
  },
  ifSellSanbai: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    return false
  },
  ifBuyWubai: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {ifHighPreCloseDown: true, ifHighPreCloseDownHigh: true}
    )) {
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-1-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-1-1'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-1-2'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'buy-1-3'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-2-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-3-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpClose': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-13-0'
      }
    }
    return false
  },
  ifSellWubai: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-20-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-21-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-22-0'
      }
    }
    return false
  },
  ifBuyYinhang: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'buy-3-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'buy-3-1'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-4-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-4-1'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true})) {
        return false
      }
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-11-0'
      }
    }
    return false
  },
  ifSellYinhang: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-20-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-21-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-22-0'
      }
    }
    return false
  },
  ifBuyDichan: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    return false
  },
  ifSellDichan: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'sell-0-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'sell-1-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-20-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-21-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-21-0'
      }
    }
    return false
  },
  ifBuyZhengquan: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    return false
  },
  ifSellZhengquan: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-20-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-21-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-22-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-23-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-24-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-25-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-26-0'
      }
    }
    return false
  },
  ifBuyJijian: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {ifHighPreCloseDown: true, ifHighPreCloseDownHigh: true}
    )) {
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-1-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-1-1'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-2-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return {
          flag: true,
          text: 'buy-3-0'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-12-0'
      }
    }
    return false
  },
  ifSellJijian: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    return false
  },
  ifBuyHuanbao: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {ifHighPreCloseDown: true, ifHighPreCloseDownHigh: true}
    )) {
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-2-0'
        }
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return {
          flag: true,
          text: 'buy-2-1'
        }
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    return false
  },
  ifSellHuanbao: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    return false
  },
  ifBuyQiche: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {ifHighPreCloseDown: true, ifHighPreCloseDownHigh: true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    return false
  },
  ifSellQiche: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    return false
  },
  ifBuyYiqian: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifHighPreCloseDown': true}
    )) {
      return {
        flag: true,
        text: 'buy-100-0'
      }
    }
    // 跌幅两倍波动的就要
    if (ifMatch(today,
      {'ifUpClose': false, 'ifCloseHigh2': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    // 下跌
    if (ifMatch(today,
      {'ifCloseHigh': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUp': false, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-101-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      if (ifMatch(lastDay,
        {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
      )) {
        return false
      }
      return {
        flag: true,
        text: 'buy-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': true, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': true, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'buy-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': false, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': true}
    )) {
      return {
        flag: true,
        text: 'buy-10-0'
      }
    }
    return false
  },
  ifSellYiqian: function (record, oneDayRecord) {
    const today = this.getFlag(record)
    const lastDay = this.getFlag(oneDayRecord)
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-0-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-1-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-2-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-3-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-4-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': false, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-5-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-6-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-7-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-8-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-9-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-10-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-11-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-12-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-13-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': true, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-14-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-15-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': false, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-16-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': false, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-17-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': true, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-18-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': true, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': true, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': true, 'ifSessionUp': true, 'ifSessionUpHigh': false, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-19-0'
      }
    }
    if (ifMatch(today,
      {'ifUpOpen': false, 'ifOpenHigh': false, 'ifUpClose': true, 'ifCloseHigh': true, 'ifSessionDown': false, 'ifSessionDownHigh': false, 'ifSessionUpClose': true, 'ifSessionUpCloseHigh': false, 'ifSessionUp': true, 'ifSessionUpHigh': true, 'ifSessionDownClose': false, 'ifSessionDownCloseHigh': false}
    )) {
      return {
        flag: true,
        text: 'sell-20-0'
      }
    }
    return false
  }
}

const codeMap = {
  'chuangye': {
    code: 'sz399006',
    name: '创业',
    threshold: 0.9,
    wave: 0.8641666666666664,
    rate: 0.9321285714285718,
    fixLine: -19,
    reduceLine: 6,
    downTrendLine: -3.3,
    mix: true,
    days: 1200,
    topLine: 15,
    cutDownLine: 30
  },
  'yiyao': {
    code: 'sh000037',
    name: '医药',
    threshold: 0.94,
    rate: 0.9339416058394158,
    wave: 0.9391726618705037,
    fixLine: -18,
    reduceLine: 5,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 11,
    cutDownLine: 19
  },
  'jisuanji': {
    code: 'sz399363',
    name: '计算机',
    attach: 'chuangye',
    threshold: 1.04,
    rate: 1.0100719424460431,
    wave: 1.06308,
    fixLine: -19,
    reduceLine: 8,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 20,
    cutDownLine: 30
  },
  'dianzi': {
    code: 'sz399811',
    name: '电子',
    attach: 'chuangye',
    threshold: 0.9,
    rate: 0.8832450331125826,
    wave: 0.9248263888888891,
    fixLine: -20.5,
    reduceLine: 6.5,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 20,
    cutDownLine: 40
  },
  'wulin': {
    code: 'sh000016',
    name: '50',
    threshold: 0.73,
    rate: 0.7160122699386505,
    wave: 0.7482424242424242,
    fixLine: -10,
    reduceLine: 4,
    downTrendLine: -3.3,
    mix: true,
    days: 1200,
    topLine: 14,
    cutDownLine: 17
  },
  'yinhang': {
    code: 'sz399986',
    name: '银行',
    threshold: 0.7,
    rate: 0.6845000000000002,
    wave: 0.7059375,
    fixLine: -10,
    reduceLine: 4,
    downTrendLine: -3.3,
    days: 1000,
    topLine: 7.5,
    cutDownLine: 14
  },
  'shipin': {
    code: 'sz399396',
    name: '食品',
    threshold: 0.85,
    rate: 0.7876623376623377,
    wave: 0.9127884615384618,
    fixLine: -15,
    reduceLine: 8,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 24,
    cutDownLine: 30
  },
  'jungong': {
    code: 'sz399959',
    name: '军工',
    attach: 'chuangye',
    threshold: 0.93,
    wave: 0.9716906474820142,
    rate: 0.8817687074829932,
    fixLine: -15,
    reduceLine: 5.5,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 16,
    cutDownLine: 24
  },
  'xinxi': {
    code: 'sh000993',
    name: '信息',
    attach: 'chuangye',
    threshold: 1.03,
    rate: 1.0703999999999998,
    wave: 0.9838741721854306,
    fixLine: -20,
    reduceLine: 6,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 18,
    cutDownLine: 27
  },
  'jijian': {
    code: 'sz399995',
    name: '基建',
    threshold: 0.62,
    rate: 0.619496855345912,
    wave: 0.628292682926829,
    fixLine: -20,
    reduceLine: 5,
    downTrendLine: 0,
    days: 1200,
    topLine: 10,
    cutDownLine: 20
  },
  'huanbao': {
    code: 'sh000827',
    name: '环保',
    threshold: 0.67,
    rate: 0.6970833333333336,
    wave: 0.6393312101910825,
    fixLine: -20,
    reduceLine: 5,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 5.5,
    cutDownLine: 7
  },
  'qiche': {
    code: 'sz399432',
    name: '汽车',
    threshold: 0.61,
    rate: 0.5677702702702703,
    wave: 0.6542647058823531,
    fixLine: -18,
    reduceLine: 5,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 5,
    cutDownLine: 7
  },
  'yiqian': {
    code: 'sh000852',
    name: '1000',
    threshold: 0.81,
    rate: 0.8312195121951221,
    wave: 0.7816081871345026,
    fixLine: -19,
    reduceLine: 5,
    downTrendLine: -3.3,
    mix: true,
    days: 1200,
    topLine: 7.5,
    cutDownLine: 15
  },
  'chuanmei': {
    code: 'sz399971',
    name: '传媒',
    attach: 'chuangye',
    threshold: 0.86,
    rate: 0.8374025974025976,
    wave: 0.8754518072289161,
    fixLine: -21,
    reduceLine: 5,
    downTrendLine: 0,
    days: 1200,
    topLine: 12,
    cutDownLine: 15
  },
  'zhengquan': {
    code: 'sz399437',
    name: '证券',
    threshold: 0.83,
    rate: 0.8198026315789474,
    wave: 0.8370723684210525,
    fixLine: -18,
    reduceLine: 9,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 15,
    cutDownLine: 30
  },
  'youse': {
    code: 'sh000823',
    name: '有色',
    threshold: 0.92,
    wave: 0.8558865248226952,
    rate: 0.9762650602409638,
    fixLine: -22,
    reduceLine: 5,
    downTrendLine: 0,
    days: 1200,
    topLine: 8.5,
    cutDownLine: 11
  },
  'dichan': {
    code: 'sz399393',
    name: '地产',
    attach: 'wulin',
    threshold: 0.94,
    rate: 0.9072847682119207,
    wave: 0.9646258503401361,
    fixLine: -18,
    reduceLine: 5,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 5.5,
    cutDownLine: 20
  },
  'yiliao': {
    code: 'sz399989',
    name: '医疗',
    attach: 'chuangye',
    threshold: 0.97,
    wave: 1.0519615384615388,
    rate: 0.8889999999999998,
    fixLine: -16,
    reduceLine: 6,
    downTrendLine: -3.3,
    days: 1000,
    topLine: 30,
    cutDownLine: 30
  },
  'shengwu': {
    code: 'sz399441',
    name: '生物',
    attach: 'chuangye',
    threshold: 0.89,
    rate: 0.8235460992907802,
    wave: 0.9630645161290321,
    fixLine: -15,
    reduceLine: 5,
    downTrendLine: -3.3,
    days: 1200,
    topLine: 30,
    cutDownLine: 30
  },
  'wubai': {
    code: 'sh000905',
    name: '500',
    threshold: 0.75,
    wave: 0.6947452229299363,
    rate: 0.7977976190476194,
    fixLine: -17.5,
    reduceLine: 5,
    downTrendLine: -3.3,
    mix: true,
    days: 1200,
    topLine: 7.5,
    cutDownLine: 9
  },
  'gangtie': {
    code: 'sz399440',
    name: '钢铁',
    threshold: 0.84,
    wave: 0.8545666666666663,
    rate: 0.8308843537414968,
    fixLine: -20,
    reduceLine: 5,
    downTrendLine: 0,
    days: 1200,
    topLine: 7,
    cutDownLine: 7
  },
  'meitan': {
    code: 'sz399998',
    name: '煤炭',
    threshold: 0.82,
    wave: 0.8193571428571426,
    rate: 0.8109589041095889,
    fixLine: -20,
    reduceLine: 5,
    downTrendLine: 0,
    days: 1200,
    topLine: 20,
    cutDownLine: 20
  },
  'baoxian': {
    code: 'sz399809',
    name: '保险',
    attach: 'wulin',
    threshold: 1,
    wave: 1.022290322580645,
    rate: 0.9797972972972975,
    fixLine: -16,
    reduceLine: 5,
    downTrendLine: -3.3,
    days: 900,
    topLine: 20,
    cutDownLine: 35
  },
  'sanbai': {
    code: 'sh000300',
    name: '300',
    threshold: 0.68,
    rate: 0.6461783439490445,
    wave: 0.7182926829268294,
    fixLine: -11.5,
    reduceLine: 5,
    downTrendLine: -3.3,
    mix: true,
    days: 1200,
    topLine: 11,
    cutDownLine: 15
  }
}
const fnMap = {
  chuangyeBuy: 'ifBuyChuangye',
  chuangyeSell: 'ifSellChuangye',
  gangtieBuy: 'ifBuyGangtie',
  gangtieSell: 'ifSellGangtie',
  jungongBuy: 'ifBuyJungong',
  jungongSell: 'ifSellJungong',
  yiyaoBuy: 'ifBuyYiyao',
  yiyaoSell: 'ifSellYiyao',
  meitanBuy: 'ifBuyMeitan',
  meitanSell: 'ifSellMeitan',
  youseBuy: 'ifBuyYouse',
  youseSell: 'ifSellYouse',
  jisuanjiBuy: 'ifBuyJisuanji',
  jisuanjiSell: 'ifSellJisuanji',
  xinxiBuy: 'ifBuyXinxi',
  xinxiSell: 'ifSellXinxi',
  shipinBuy: 'ifBuyShipin',
  shipinSell: 'ifSellShipin',
  baoxianBuy: 'ifBuyBaoxian',
  baoxianSell: 'ifSellBaoxian',
  wulinBuy: 'ifBuyWulin',
  wulinSell: 'ifSellWulin',
  chuanmeiBuy: 'ifBuyChuanmei',
  chuanmeiSell: 'ifSellChuanmei',
  dianziBuy: 'ifBuyDianzi',
  dianziSell: 'ifSellDianzi',
  yiliaoBuy: 'ifBuyYiliao',
  yiliaoSell: 'ifSellYiliao',
  shengwuBuy: 'ifBuyShengwu',
  shengwuSell: 'ifSellShengwu',
  sanbaiBuy: 'ifBuySanbai',
  sanbaiSell: 'ifSellSanbai',
  wubaiBuy: 'ifBuyWubai',
  wubaiSell: 'ifSellWubai',
  dichanBuy: 'ifBuyDichan',
  dichanSell: 'ifSellDichan',
  yinhangBuy: 'ifBuyYinhang',
  yinhangSell: 'ifSellYinhang',
  zhengquanBuy: 'ifBuyZhengquan',
  zhengquanSell: 'ifSellZhengquan',
  jijianBuy: 'ifBuyJijian',
  jijianSell: 'ifSellJijian',
  huanbaoBuy: 'ifBuyHuanbao',
  huanbaoSell: 'ifSellHuanbao',
  qicheBuy: 'ifBuyQiche',
  qicheSell: 'ifSellQiche',
  yiqianBuy: 'ifBuyYiqian',
  yiqianSell: 'ifSellYiqian'
}

const IndexInfoUtilXiong = {
  Util,
  codeMap,
  fnMap,
  formatData: function (list) {
    // 把数据集合扁平化
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
      })
    }
    list.forEach((item, index) => {
      let value = Math.abs(numberUtil.countDifferenceRate(item.kline.close, item.kline.preClose))
      let value2 = Math.abs(numberUtil.countDifferenceRate(item.kline.high, item.kline.low))
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
    })
    let all = 0
    let count = 0
    let all2 = 0
    let count2 = 0
    for (let k = 0; k < xData.length; k++) {
      if (xData[k].count >= 5) {
        count = count + xData[k].count
        for (let c = 0; c < xData[k].countList.length; c++) {
          all = all + xData[k].countList[c]
        }
      }
      if (xData[k].count2 >= 5) {
        count2 = count2 + xData[k].count2
        for (let b = 0; b < xData[k].countList2.length; b++) {
          all2 = all2 + xData[k].countList2[b]
        }
      }
    }
    xData.sort((a, b) => {
      return b.count2 - a.count2
    })
    let a = (all2 / count2) / 2
    let c = all / count
    let threshold = numberUtil.keepTwoDecimals((a + c) / 2)
    // console.log(xData)
    // console.log(count)
    // console.log(count2)
    console.log('wave:  ' + a)
    console.log('rate:  ' + c)
    console.log(threshold)
    return {list: listTemp, threshold: threshold, rate: c, wave: a}
  }
}

export default IndexInfoUtilXiong
