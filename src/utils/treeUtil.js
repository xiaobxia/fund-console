function getChildrenKeys(children, key) {
  let keys = []
  for (let i = 0; i < children.length; i++) {
    const item = children[i]
    keys.push(item[key])
    if (item.children && item.children.length > 0) {
      keys = keys.concat(getChildrenKeys(item.children, key))
    }
  }
  return keys
}

export default {
  getChildrenKeys
}
