/**
 * Created by xiaobxia on 2018/1/26.
 */
import http from 'localUtil/httpUtil';
const FOCUSFUND_INIT_STORE = 'FOCUSFUND_INIT_STORE';
const FOCUSFUND_QUERY_FOCUSFUNDS_BEGIN = 'FOCUSFUND_QUERY_FOCUSFUNDS_BEGIN';
const FOCUSFUND_QUERY_FOCUSFUNDS_SUC = 'FOCUSFUND_QUERY_FOCUSFUNDS_SUC';

export const focusFundActions = {
  initStore() {
    return (dispatch, getState) => {
      dispatch({type: FOCUSFUND_INIT_STORE});
    };
  },
  queryFocusFunds(queryString) {
    return (dispatch, getState) => {
      dispatch({type: FOCUSFUND_QUERY_FOCUSFUNDS_BEGIN});
      return http.get('focusFund/getFocusFunds').then((data) => {
        dispatch({type: FOCUSFUND_QUERY_FOCUSFUNDS_SUC, data: data.data});
        console.log(data)
        return data;
      });
    };
  }
};

const focusFundStore = {
  focusFundList: [],
  tableLoading: false,
  currentFocusFund: {}
};
export const focusFundReducers = (state = focusFundStore, action) => {
  let store = Object.assign({}, state);
  switch (action.type) {
    case FOCUSFUND_INIT_STORE: {
      store = Object.assign({}, focusFundStore);
      return store;
    }
    case FOCUSFUND_QUERY_FOCUSFUNDS_BEGIN: {
      store.focusFundList = [];
      store.tableLoading = true;
      return store;
    }
    case FOCUSFUND_QUERY_FOCUSFUNDS_SUC: {
      const data = action.data;
      store.focusFundList = data.list;
      store.tableLoading = false;
      return store;
    }
    //TODO 需要有default返回返回旧的state
    default: {
      return state
    }
  }
};

