/**
 * Created by xiaobxia on 2017/10/19.
 */
import { combineReducers } from 'redux'
import {appReducers} from './module/app';
import {myFundReducers} from './module/myFund';
import {fundReducers} from './module/fund';
import {strategyReducers} from './module/strategy';
import {focusFundReducers} from './module/focusFund';
import {lowRateFundReducers} from './module/lowRateFund';
import {scheduleReducers} from './module/schedule';
import {myNetValueReducers} from './module/myNetValue';
export default combineReducers({
  app: appReducers,
  myFund: myFundReducers,
  fund: fundReducers,
  strategy: strategyReducers,
  focusFund: focusFundReducers,
  lowRateFund: lowRateFundReducers,
  schedule: scheduleReducers,
  myNetValue: myNetValueReducers
})
