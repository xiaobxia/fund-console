import ScrollTable from './scrollTable'

const install = function(Vue) {
  Vue.directive('ScrollTable', ScrollTable)
}

ScrollTable.install = install
export default ScrollTable
