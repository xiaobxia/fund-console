/**
 * Created by xiaobxia on 2017/8/28.
 */
import moment from 'moment';

export default {
  formatToDay(date) {
    return moment(date).format('YYYY-MM-DD');
  },
  formatToDayTime(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  }
};
