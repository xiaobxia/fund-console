/**
 * Created by xiaobxia on 2018/4/5.
 */
import http from 'localUtil/httpUtil';
const MY_NET_VALUE_INIT_STORE = 'MY_NET_VALUE_INIT_STORE';
const MY_NET_VALUE_QUERY_MY_NET_VALUES_BEGIN = 'MY_NET_VALUE_QUERY_MY_NET_VALUES_BEGIN';
const MY_NET_VALUE_QUERY_MY_NET_VALUES_SUC = 'MY_NET_VALUE_QUERY_MY_NET_VALUES_SUC';

export const myNetValueActions = {
  initStore() {
    return (dispatch, getState) => {
      dispatch({type: MY_NET_VALUE_INIT_STORE});
    };
  },
  queryMyNetValues(query) {
    return (dispatch, getState) => {
      dispatch({type: MY_NET_VALUE_QUERY_MY_NET_VALUES_BEGIN});
      return http.get('userFund/getUserNetValues', query).then((data) => {
        dispatch({type: MY_NET_VALUE_QUERY_MY_NET_VALUES_SUC, data: data.data});
        return data;
      });
    };
  }
};

const myNetValueStore = {
  tableLoading: false,
  myNetValueList: [],
  pagination: {}
};
export const myNetValueReducers = (state = myNetValueStore, action) => {
  let store = Object.assign({}, state);
  switch (action.type) {
    case MY_NET_VALUE_INIT_STORE: {
      store = Object.assign({}, myNetValueStore);
      return store;
    }
    case MY_NET_VALUE_QUERY_MY_NET_VALUES_BEGIN: {
      store.tableLoading = true;
      // store.myNetValueList = [];
      // store.pagination = {};
      return store;
    }
    case MY_NET_VALUE_QUERY_MY_NET_VALUES_SUC: {
      const data = action.data;
      store.myNetValueList = data.list;
      store.pagination = data.page;
      store.tableLoading = false;
      return store;
    }
    //TODO 需要有default返回返回旧的state
    default: {
      return state
    }
  }
};
