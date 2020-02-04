// 基于常量的选择框数据，列表数据格式化
function findLabel(list, value) {
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    if (item.value === value) {
      return item.label
    }
  }
  return ''
}
// 用户状态
const USER_STATUS_LIST = [
  { value: '0', label: '禁用' },
  { value: '1', label: '启用' }
]
export default {
  USER_STATUS_LIST,
  formatUserStatus(value) {
    return findLabel(USER_STATUS_LIST, value)
  }
}
