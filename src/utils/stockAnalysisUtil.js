import numberUtil from './numberUtil'
export default {
  // 根据20天线判断是否锁仓
  ifNoSell: function(averageList) {
    const last = averageList[averageList.length - 1]
    const lastTwo = averageList[averageList.length - 2]
    // 首先今天它得在线上
    if (last > 0) {
      let max = 0
      let maxIndex = 0
      // 找出近期最大的
      for (let i = 0; i < (averageList.length - 2); i++) {
        const now = averageList[i]
        if (now > max) {
          max = now
          maxIndex = i
        }
      }
      // 最大的也在线下
      if (max <= 0) {
        // 倒数第二个在线上
        if (lastTwo > 0) {
          return true
        }
        // 刚到线上的第一个不要
        return false
      } else {
        // 得把倒数第二个也加进来
        if (lastTwo > max) {
          max = lastTwo
          maxIndex = averageList.length - 2
        }
        // 和最大的对比
        for (let j = maxIndex; j < averageList.length; j++) {
          const now = averageList[j]
          if (now < (max * 0.5)) {
            return false
          }
        }
        return true
      }
    }
    return false
  },
  countRule(netChangeRatioList, rule) {
    let rate = 0
    for (let i = 0; i < rule.length; i++) {
      if (rule[i]) {
        // 涨
        if (netChangeRatioList[i] <= 0) {
          return {
            flag: false
          }
        }
      } else {
        // 跌
        if (netChangeRatioList[i] > 0) {
          return {
            flag: false
          }
        }
      }
      rate += netChangeRatioList[i]
    }
    return {
      rate,
      flag: true
    }
  },
  // 计算跌的数量
  countDown(netChangeRatioList, all, has) {
    let rate = 0
    const last = netChangeRatioList[all - 1]
    if (netChangeRatioList[0] < 0 && last < 0) {
      let count = 0
      for (let i = 0; i < all; i++) {
        if (netChangeRatioList[i] < 0) {
          count++
        }
        rate += netChangeRatioList[i]
      }
      if (count >= has) {
        return {
          rate,
          flag: true
        }
      }
    }
    return {
      flag: false
    }
  },
  // 计算涨的数量
  countUp(netChangeRatioList, all, has) {
    let rate = 0
    const last = netChangeRatioList[all - 1]
    if (netChangeRatioList[0] > 0 && last > 0) {
      let count = 0
      for (let i = 0; i < all; i++) {
        if (netChangeRatioList[i] > 0) {
          count++
        }
        rate += netChangeRatioList[i]
      }
      if (count >= has) {
        return {
          rate,
          flag: true
        }
      }
    }
    return {
      flag: false
    }
  },
  // 计算连跌0.2的三天
  countLowDown(netChangeRatioList) {
    if (
      netChangeRatioList[0] <= 0 &&
      netChangeRatioList[1] <= 0
      // netChangeRatioList[2] <= 0
    ) {
      if (
        netChangeRatioList[0] >= -0.3 &&
        netChangeRatioList[1] >= -0.3
        // netChangeRatioList[2] >= -0.3
      ) {
        return {
          flag: true
        }
      }
    }
    return {
      flag: false
    }
  },
  // 计算连跌0.2的三天
  countLowDown2(netChangeRatioList) {
    if (
      netChangeRatioList[0] <= 0 &&
      netChangeRatioList[1] <= 0
    // netChangeRatioList[2] < 0
    ) {
      if (
        netChangeRatioList[0] >= -0.3 &&
        netChangeRatioList[1] >= -0.3
      // netChangeRatioList[2] >= -0.2
      ) {
        return {
          flag: true
        }
      }
    }
    return {
      flag: false
    }
  },
  // 计算连涨0.2的三天
  countLowUp(netChangeRatioList) {
    if (
      netChangeRatioList[0] > 0 &&
      netChangeRatioList[1] > 0 &&
      netChangeRatioList[2] > 0
    ) {
      if (
        netChangeRatioList[0] <= 0.2 &&
        netChangeRatioList[1] <= 0.2 &&
        netChangeRatioList[2] <= 0.2
      ) {
        return {
          flag: true
        }
      }
    }
    return {
      flag: false
    }
  },
  // 近几天最高点最低点
  lowWake(recentList, rate) {
    let max = recentList[0].high
    let min = recentList[0].low
    for (let i = 0; i < 6; i++) {
      const item = recentList[i]
      if (item.high > max) {
        max = item.high
      }
      if (item.low < min) {
        min = item.low
      }
    }
    if (numberUtil.countDifferenceRate(max, min) <= (rate || 1.5)) {
      return {
        flag: true
      }
    }
    return {
      flag: false
    }
  },
  // 变盘
  countChangePan(netChangeRatioList, indexRate) {
    const a = netChangeRatioList[0]
    const b = netChangeRatioList[1]
    const c = netChangeRatioList[2]
    if (a < 0 && b > 0 && c < 0) {
      if (a > -(0.3 * indexRate) && b < (0.3 * indexRate)) {
        return true
      }
    }
    return false
  },
  lowW(netChangeRatioList, indexRate) {
    const a = netChangeRatioList[0]
    const b = netChangeRatioList[1]
    const c = netChangeRatioList[2]
    if (a < 0 && b < 0 && c > 0) {
      if (Math.abs(a) < 0.3 && Math.abs(b) < 0.3 && Math.abs(c) < 0.3) {
        return true
      }
    }
    return false
  },
  // -----波动研究
  highRate(kline) {
    return numberUtil.countDifferenceRate(kline.high, kline.preClose)
  },
  openRate(kline) {
    return numberUtil.countDifferenceRate(kline.open, kline.preClose)
  },
  lowRate(kline) {
    return numberUtil.countDifferenceRate(kline.low, kline.preClose)
  },
  highLowRate(kline) {
    return numberUtil.countDifferenceRate(kline.high, kline.low)
  },
  highCloseRate(kline) {
    return numberUtil.countDifferenceRate(kline.high, kline.close)
  },
  openHigh(kline, indexRate) {
    if (this.openRate(kline) > indexRate) {
      return true
    }
    return false
  },
  openLow(kline, indexRate) {
    if (this.openRate(kline) < -indexRate) {
      return true
    }
    return false
  },
  hdown(kline, indexRate) {
    if (this.highRate(kline) > 3 * indexRate) {
      if (kline.netChangeRatio < 0) {
        return true
      }
    }
    return false
  },
  hdown2(kline, indexRate) {
    if (this.highCloseRate(kline) > 3 * indexRate) {
      if (kline.netChangeRatio > 0) {
        return true
      }
    }
    return false
  },
  hdown3(kline, indexRate) {
    if (this.highRate(kline) > 2 * indexRate) {
      if (kline.netChangeRatio < 0) {
        return true
      }
    }
    return false
  },
  lowUp(kline, indexRate) {
    if (this.lowRate(kline) < -(3 * indexRate)) {
      if (kline.netChangeRatio > 0) {
        return true
      }
    }
    return false
  },
  lowUp2(kline, indexRate) {
    if (this.lowRate(kline) < -(2 * indexRate)) {
      if (kline.netChangeRatio > 0) {
        return true
      }
    }
    return false
  },
  openIsLow(kline, indexRate) {
    if (kline.open <= kline.low) {
      return true
    }
    return false
  },
  openIsHigh(kline, indexRate) {
    if (kline.open >= kline.high) {
      return true
    }
    return false
  },
  highLowPre(kline, indexRate) {
    if (kline.high < kline.preClose) {
      return true
    }
    return false
  },
  lwDay(kline, indexRate) {
    if (this.highLowRate(kline) < (0.5 * indexRate)) {
      return true
    }
    return false
  },
  // 纠缠
  tangleLine(line5, line10, line20, config) {
    function countRange(c5, c10, c20) {
      const list = [c5, c10, c20]
      list.sort((a, b)=>{
        return b-a
      })
      return numberUtil.countDifferenceRate(list[0], list[list.length - 1])
    }
    let flag = true
    line5.forEach((item, index)=>{
      if (index < (config.days - 1)) {
        const rate = countRange(line5[index], line10[index], line20[index])
        if (rate > config.rate) {
          flag = false
        }
      }
    })
    return flag
  }
}
