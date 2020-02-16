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
  }
}
