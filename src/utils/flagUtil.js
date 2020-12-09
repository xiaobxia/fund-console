import stockAnalysisUtil from '@/utils/stockAnalysisUtil'
const flagUtil = {
  oneDeep(indexItem, netChangeRatioList) {
    return netChangeRatioList[0] < (6 * indexItem.rate)
  },
  // 定投卖出
  fixSell(diffInfo, indexItem, netChangeRatioList, qH) {
    if (
      diffInfo.rateQ >= indexItem.quarterHotLine &&
      !diffInfo.noSell &&
      diffInfo.rateM > 0 &&
      netChangeRatioList[0] > 0
    ) {
      if (stockAnalysisUtil.countUp(netChangeRatioList, 2, 2).flag) {
        return true
      }
    }
    if (!diffInfo.noSell && diffInfo.rateQ > 0 && qH) {
      if (stockAnalysisUtil.countUp(netChangeRatioList, 3, 3).flag) {
        return true
      }
      if (stockAnalysisUtil.countUp(netChangeRatioList, 2, 2).flag) {
        if (stockAnalysisUtil.countUp(netChangeRatioList, 2, 2).rate > (3 * indexItem.rate)) {
          return true
        }
      }
    }
    if (
      diffInfo.rateY >= indexItem.cutDownLine &&
      !diffInfo.noSell &&
      diffInfo.rateQ > 0
    ) {
      if (['yiliao', 'shengwu'].indexOf(indexItem.key) === -1) {
        if (stockAnalysisUtil.countUp(netChangeRatioList, 2, 2).flag) {
          return true
        }
        if (['chuangye', 'shiping', 'wubai', 'sanbai'].indexOf(indexItem.key) === -1) {
          if (stockAnalysisUtil.countUp(netChangeRatioList, 1, 1).flag) {
            if (stockAnalysisUtil.countUp(netChangeRatioList, 1, 1).rate > (1 * indexItem.rate)) {
              return true
            }
          }
        }
      }
    }
    return false
  },
  sell(diffInfo, indexItem, netChangeRatioList, qH) {
    const info = stockAnalysisUtil.countUp(netChangeRatioList, 2, 2)
    if (info.rate > (indexItem.rate * 4)) {
      return true
    }
    const a = stockAnalysisUtil.countRule(netChangeRatioList, [true, true, false, true, true])
    if (a.flag && a.rate > (4 * indexItem.rate)) {
      return true
    }
    const aa = stockAnalysisUtil.countUp(netChangeRatioList, 4, 3)
    if (netChangeRatioList[0] > 0 && netChangeRatioList[3] > 0) {
      if (aa.flag && aa.rate > (4 * indexItem.rate)) {
        return true
      }
    }
    const bb = stockAnalysisUtil.countRule(netChangeRatioList, [true, false, true])
    if (bb.flag && bb.rate > (4 * indexItem.rate)) {
      return true
    }
    if (diffInfo.rateM < 0) {
      const info = stockAnalysisUtil.countUp(netChangeRatioList, 3, 3)
      if (info.flag && info.rate > (indexItem.rate * 4)) {
        return true
      }
    }
    if (diffInfo.rateM > 0) {
      const info = stockAnalysisUtil.countUp(netChangeRatioList, 1, 1)
      if (info.flag && info.rate > (1 * indexItem.rate)) {
        return true
      }
      const cc = stockAnalysisUtil.countUp(netChangeRatioList, 2, 2)
      if (cc.flag) {
        return true
      }
    }
  }
}

export default flagUtil
