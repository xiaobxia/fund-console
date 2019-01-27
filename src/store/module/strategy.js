/**
 * Created by xiaobxia on 2018/1/26.
 */
import http from 'localUtil/httpUtil';
const STRATEGY_INIT_STORE = 'STRATEGY_INIT_STORE';
const STRATEGY_QUERY_STRATEGYS_BEGIN = 'STRATEGY_QUERY_STRATEGYS_BEGIN';
const STRATEGY_QUERY_STRATEGYS_SUC = 'STRATEGY_QUERY_STRATEGYS_SUC';
const STRATEGY_QUERY_MY_STRATEGYS_BEGIN = 'STRATEGY_QUERY_MY_STRATEGYS_BEGIN';
const STRATEGY_QUERY_MY_STRATEGYS_SUC = 'STRATEGY_QUERY_MY_STRATEGYS_SUC';

export const strategyActions = {
  initStore() {
    return (dispatch, getState) => {
      dispatch({type: STRATEGY_INIT_STORE});
    };
  },
  queryStrategy(force) {
    return (dispatch, getState) => {
      dispatch({type: STRATEGY_QUERY_STRATEGYS_BEGIN});
      return http.get('strategy/getStrategy', {force}).then((data) => {
        dispatch({type: STRATEGY_QUERY_STRATEGYS_SUC, data: data.data});
        console.log(data)
        return data;
      });
    };
  },
  queryMyStrategy(force) {
    return (dispatch, getState) => {
      dispatch({type: STRATEGY_QUERY_MY_STRATEGYS_BEGIN});
      return http.get('strategy/getMyStrategy', {force}).then((data) => {
        dispatch({type: STRATEGY_QUERY_MY_STRATEGYS_SUC, data: data.data});
        console.log(data)
        return data;
      });
    };
  }
};

const strategyStore = {
  tableLoading: false,
  strategyListSlump: [],
  strategyListBoom: [],
  myStrategyList: [],
  myTableLoading: false
};
export const strategyReducers = (state = strategyStore, action) => {
  let store = Object.assign({}, state);
  switch (action.type) {
    case STRATEGY_INIT_STORE: {
      store = Object.assign({}, strategyStore);
      return store;
    }
    case STRATEGY_QUERY_STRATEGYS_BEGIN: {
      store.strategyListSlump = [];
      store.strategyListBoom = [];
      store.tableLoading = true;
      return store;
    }
    case STRATEGY_QUERY_STRATEGYS_SUC: {
      const data = action.data;
      store.strategyListSlump = data.slump;
      store.strategyListBoom = data.boom;
      store.tableLoading = false;
      return store;
    }
    case STRATEGY_QUERY_MY_STRATEGYS_BEGIN: {
      store.myStrategyList = [];
      store.myTableLoading = true;
      return store;
    }
    case STRATEGY_QUERY_MY_STRATEGYS_SUC: {
      const data = action.data;
      store.myStrategyList = data.strategy;
      store.myTableLoading = false;
      return store;
    }
    //TODO 需要有default返回返回旧的state
    default: {
      return state
    }
  }
};

