const fileUtil = {
  /**
   * 获取文件名后缀
   * @param filename
   * @returns {*}
   */
  getSuffix(filename) {
    if (filename) {
      const lastIndex = filename.lastIndexOf('.');
      return filename.substring(lastIndex + 1);
    }
    return '';
  }
};

export default fileUtil;
