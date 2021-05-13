import numberUtil from '@/utils/numberUtil.js'

function build_diff_data(m_short, m_long, data) {
  var result = []
  var pre_emashort = 0
  var pre_emalong = 0
  for (var i = 0, len = data.length; i < len; i++) {
    var ema_short = data[i].close
    var ema_long = data[i].close
    if (i !== 0) {
      ema_short = (2 / (m_short + 1)) * data[i].close + (11 / (m_short + 1)) * pre_emashort
      ema_long = (2 / (m_long + 1)) * data[i].close + (25 / (m_long + 1)) * pre_emalong
    }
    pre_emashort = ema_short
    pre_emalong = ema_long
    var diff = ema_short - ema_long
    result.push(diff)
  }
  return result
}

function build_dea_data(m, diff) {
  var result = []
  var pre_ema_diff = 0
  for (var i = 0, len = diff.length; i < len; i++) {
    var ema_diff = diff[i]
    if (i !== 0) {
      ema_diff = (2 / (m + 1)) * diff[i] + (8 / (m + 1)) * pre_ema_diff
    }
    pre_ema_diff = ema_diff
    result.push(ema_diff)
  }
  return result
}

function build_macd_data(data, diff, dea) {
  var result = []
  for (var i = 0, len = data.length; i < len; i++) {
    var macd = 2 * (diff[i] - dea[i])
    result.push(macd)
  }
  return result
}

function checkUpDown(list, index, fList) {
  let c = true
  const len = fList.length
  fList.forEach((f, i) => {
    const l = list[index - (len - i)]
    if (f) {
      if (l < 0) {
        c = false
      }
    } else {
      if (l > 0) {
        c = false
      }
    }
  })
  return c
}

const Macd = {
  macd_data(data) {
    const diff = build_diff_data(12, 26, data)
    const dea = build_dea_data(9, diff)
    return build_macd_data(data, diff, dea)
  },
  getMacdUpDiff(macdList, kline) {
    const lastIndex = macdList.length - 1
    if (macdList[lastIndex] < 0 && macdList[lastIndex - 1] > 0) {
      // 是转折
      const close = kline[lastIndex].close
      let startIndex = 0
      for (let i = lastIndex - 1; i >= 0; i--) {
        if (macdList[i] < 0) {
          startIndex = i + 1
          break
        }
      }
      const open = kline[startIndex].open
      return numberUtil.countDifferenceRate(close, open)
    }
    return 0
  },
  getMacdDownDiff(macdList, kline) {
    const lastIndex = macdList.length - 1
    if (macdList[lastIndex] > 0 && macdList[lastIndex - 1] < 0) {
      // 是转折
      const close = kline[lastIndex].close
      let startIndex = 0
      for (let i = lastIndex - 1; i >= 0; i--) {
        if (macdList[i] > 0) {
          startIndex = i + 1
          break
        }
      }
      const open = kline[startIndex].open
      return numberUtil.countDifferenceRate(close, open)
    }
    return 0
  },
  sellDiffMap(diff) {
    if (diff > 35) {
      return 0.4
    }
    if (diff > 30) {
      return 0.35
    }
    if (diff > 25) {
      return 0.3
    }
    if (diff > 20) {
      return 0.25
    }
    if (diff > 15) {
      return 0.2
    }
    if (diff > 10) {
      return 0.15
    }
    if (diff > 5) {
      return 0.1
    }
    return 0
  },
  checkUpDown,
  getDiff5To10Macd(macdList, diff5to10List, index) {
    const macdVal = macdList[index]
    const macdValLast = macdList[index - 1]
    const diff5to10Val = diff5to10List[index]
    const diff5to10ValLast = diff5to10List[index - 1]
    let ismacdValToUp = false
    let ismacdValToDown = false
    let buyTwo = false
    let sellTwo = false
    if (macdVal > 0) {
      if (macdValLast > 0) {
        buyTwo = true
        ismacdValToUp = checkUpDown(macdList, index, [false, false, true])
      } else {
        ismacdValToUp = checkUpDown(macdList, index, [false, false])
      }
    } else {
      if (macdValLast < 0) {
        sellTwo = true
        ismacdValToDown = checkUpDown(macdList, index, [true, true, false])
      } else {
        ismacdValToDown = checkUpDown(macdList, index, [true, true])
      }
    }

    let isDiff5to10ValToUp = false
    let isDiff5to10ValToDown = false
    if (diff5to10Val > 0) {
      if (diff5to10ValLast > 0) {
        buyTwo = true
        isDiff5to10ValToUp = checkUpDown(diff5to10List, index, [false, false, true])
      } else {
        isDiff5to10ValToUp = checkUpDown(diff5to10List, index, [false, false])
      }
    } else {
      if (diff5to10ValLast < 0) {
        sellTwo = true
        isDiff5to10ValToDown = checkUpDown(diff5to10List, index, [true, true, false])
      } else {
        isDiff5to10ValToDown = checkUpDown(diff5to10List, index, [true, true])
      }
    }
    return {
      ismacdValToUp,
      ismacdValToDown,
      isDiff5to10ValToUp,
      isDiff5to10ValToDown,
      buyTwo,
      sellTwo
    }
  }
}

export default Macd
