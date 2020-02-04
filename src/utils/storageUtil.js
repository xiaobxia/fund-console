function formatKey(key) {
  return `vueAdminCli-${key}`
}
function localStorageGetItem(key) {
  return localStorage.getItem(formatKey(key))
}
function localStorageSetItem(key, data) {
  return localStorage.setItem(formatKey(key), data)
}
function localStorageRemoveItem(key) {
  return localStorage.removeItem(formatKey(key))
}
const storageUtil = {
  getData: function(name, key) {
    let value = {}
    if (window[`_${name}`]) {
      value = window[`_${name}`]
    } else {
      const valueString = localStorageGetItem(name)
      if (valueString) {
        value = JSON.parse(valueString)
      }
      window[`_${name}`] = value
    }
    if (key) {
      return value[key]
    }
    return value
  },
  setData: function(name, key, value) {
    let data = this.getData(name)
    if (typeof key === 'object') {
      value = key
      data = value
    } else {
      data[key] = value
    }
    window[`_${name}`] = data
    localStorageSetItem(name, JSON.stringify(data))
    return data
  },
  clearAll: function() {
    window.localStorage.clear()
  },
  localStorageRemoveItem
}

export default storageUtil
