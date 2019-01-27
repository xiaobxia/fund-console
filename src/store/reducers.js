/**
 * Created by xiaobxia on 2017/10/19.
 */
import { combineReducers } from 'redux'
import {appReducers} from './module/app';
import {myFundReducers} from './module/myFund';
import {fundReducers} from './module/fund';
import {scheduleReducers} from './module/schedule';
import {myNetValueReducers} from './module/myNetValue';
export default combineReducers({
  app: appReducers,
  myFund: myFundReducers,
  fund: fundReducers,
  schedule: scheduleReducers,
  myNetValue: myNetValueReducers
})
