const arrayUtil = {
  findObjectItem(array, keyName, keyValue) {
    for (let k = 0, len = array.length; k < len; k++) {
      if (array[k][keyName] === keyValue) {
        return array[k];
      }
    }
  },
  removeObjectItem(array, keyName, keyValue) {
    for (let i = 0; i < array.length; i++) {
      let item = array[i];
      if (item[keyName] === keyValue) {
        array.splice(i, 1);
        break;
      }
    }
  },
  copy(array) {
    let newArray = []
    for (let i = 0; i < array.length; i++) {
      newArray.push(array[i])
    }
    return array
  }
};

export default arrayUtil;
