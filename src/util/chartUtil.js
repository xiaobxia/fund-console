/**
 * Created by xiaobxia on 2018/8/20.
 */
const chartUtil = {
  /**
   * 获取均线
   * @param lineList 数据源
   * @param day 几日均线
   * @param key 数据的key
   * @returns {Array}
   */
  getAverageLineList (lineList, day, key) {
    let list = []
    lineList.forEach((item, index) => {
      const average = this.getAverage(lineList, day, index, key)
      list.push(average)
    })
    return list
  },
  /**
   * 获取某一天的某一均线的值
   * @param lineList 数据源
   * @param day 几日均线
   * @param index 具体某天的索引
   * @param key 数据的key
   * @returns {number}
   */
  getAverage (lineList, day, index, key) {
    let start = index - day + 1
    start = start < 0 ? 0 : start
    let count = 0
    for (let i = index; i >= start; i--) {
      if (key) {
        count += lineList[i][key]
      } else {
        count += lineList[i]
      }
    }
    return count / (index + 1 - start)
  }
};

export default chartUtil;
