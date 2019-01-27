/**
 * Created by xiaobxia on 2018/4/5.
 */
const numberUtil = {
  countRate: function (numerator, denominator) {
    return Math.round(10000 * (numerator / denominator)) / 100;
  },
  countDifferenceRate: function (numerator, denominator) {
    return Math.round(10000 * ((numerator - denominator) / denominator)) / 100;
  },

  keepTwoDecimals: function (number) {
    return Math.round(100 * number) / 100;
  },

  keepFourDecimals: function (number) {
    return Math.round(10000 * number) / 10000;
  }
};

export default numberUtil;

