export default {
  pushArray(a, b) {
    const list = []
    for (let i = 0; i < b.length; i++) {
      if (a.indexOf(b[i]) === -1) {
        list.push(b[i])
      }
    }
    return a.concat(list)
  },
  removeArray(a, b) {
    const list = []
    for (let i = 0; i < a.length; i++) {
      if (b.indexOf(a[i]) === -1) {
        list.push(a[i])
      }
    }
    return list
  },
  findItem(list, key, value) {
    for (let i = 0; i < list.length; i++) {
      const item = list[i]
      if (item[key] === value) {
        return item
      }
    }
    return null
  }
}
