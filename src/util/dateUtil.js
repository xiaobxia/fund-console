/**
 * Created by xiaobxia on 2017/8/28.
 */
import moment from 'moment'

export default {
  formatToDay (date) {
    return moment(date).format('YYYY-MM-DD')
  },
  formatToDayTime (date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss')
  },
  findNearlyNetValueIndex (netValueList, type, count) {
    // 最多的天数
    const lastDay = moment().subtract(count || 1, type + 's')
    let maxNetValueDay = type === 'year' ? 260 : 25
    const startIndex = netValueList.length > maxNetValueDay ? (netValueList.length - maxNetValueDay) : 0
    for (let i = startIndex; i < netValueList.length; i++) {
      const item = netValueList[i]
      // 理论上第一个是在lastDay之前的
      if (lastDay.isBefore(item.net_value_date)) {
        return i
      }
    }
  },
  /**
   * 找到范围开始的前一天
   * @param netValueList
   * @param type
   * @returns {number}
   */
  findSameRangeStartNetValueIndex (netValueList, type) {
    let index = 0
    for (let i = netValueList.length - 1; i >= 0; i--) {
      const item = netValueList[i]
      if (!moment().isSame(item.net_value_date, type)) {
        index = i
        break
      }
    }
    return index
  },
  /**
   * 某月开始和结束的日子的索引
   * @param netValueList
   * @param monthTime
   * @returns {{start: number, end: number}}
   */
  findSameMonthStartEndIndex (netValueList, monthTime) {
    let data = {
      start: 0,
      end: 0
    }
    for (let i = netValueList.length - 1; i >= 0; i--) {
      const item = netValueList[i]
      if (moment(monthTime).isSame(item.net_value_date, 'month')) {
        if (data.end === 0) {
          data.end = i
        }
        data.start = i
      } else {
        if (data.start !== 0) {
          break
        }
      }
    }
    return data
  }
}
