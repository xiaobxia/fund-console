/**
 * Created by xiaobxia on 2018/1/26.
 */
import http from 'localUtil/httpUtil';
const LOWRATEFUND_INIT_STORE = 'LOWRATEFUND_INIT_STORE';
const LOWRATEFUND_QUERY_LOWRATEFUNDS_BEGIN = 'LOWRATEFUND_QUERY_LOWRATEFUNDS_BEGIN';
const LOWRATEFUND_QUERY_LOWRATEFUNDS_SUC = 'LOWRATEFUND_QUERY_LOWRATEFUNDS_SUC';

export const lowRateFundActions = {
  initStore() {
    return (dispatch, getState) => {
      dispatch({type: LOWRATEFUND_INIT_STORE});
    };
  },
  queryLowRateFunds(queryString) {
    return (dispatch, getState) => {
      dispatch({type: LOWRATEFUND_QUERY_LOWRATEFUNDS_BEGIN});
      return http.get('strategy/getLowRateStrategy').then((data) => {
        dispatch({type: LOWRATEFUND_QUERY_LOWRATEFUNDS_SUC, data: data.data});
        return data;
      });
    };
  }
};

const lowRateFundStore = {
  lowRateFundList: [],
  tableLoading: false,
  currentLowRateFund: {}
};
export const lowRateFundReducers = (state = lowRateFundStore, action) => {
  let store = Object.assign({}, state);
  switch (action.type) {
    case LOWRATEFUND_INIT_STORE: {
      store = Object.assign({}, lowRateFundStore);
      return store;
    }
    case LOWRATEFUND_QUERY_LOWRATEFUNDS_BEGIN: {
      store.lowRateFundList = [];
      store.tableLoading = true;
      return store;
    }
    case LOWRATEFUND_QUERY_LOWRATEFUNDS_SUC: {
      const data = action.data;
      store.lowRateFundList = data.strategy;
      store.tableLoading = false;
      return store;
    }
    //TODO 需要有default返回返回旧的state
    default: {
      return state
    }
  }
};

