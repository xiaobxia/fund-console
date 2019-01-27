/**
 * Created by xiaobxia on 2018/3/6.
 */
import http from 'localUtil/httpUtil';
const SCHEDULE_INIT_STORE = 'SCHEDULE_INIT_STORE';
const SCHEDULE_QUERY_SCHEDULES_BEGIN = 'SCHEDULE_QUERY_SCHEDULES_BEGIN';
const SCHEDULE_QUERY_SCHEDULES_SUC = 'SCHEDULE_QUERY_SCHEDULES_SUC';

export const scheduleActions = {
  initStore() {
    return (dispatch, getState) => {
      dispatch({type: SCHEDULE_INIT_STORE});
    };
  },
  querySchedules(queryString) {
    return (dispatch, getState) => {
      dispatch({type: SCHEDULE_QUERY_SCHEDULES_BEGIN});
      return http.get('schedule/all').then((data) => {
        dispatch({type: SCHEDULE_QUERY_SCHEDULES_SUC, data: data.data});
        console.log(data)
        return data;
      });
    };
  }
};

const scheduleStore = {
  scheduleList: [],
  tableLoading: false,
  currentSchedule: {}
};
export const scheduleReducers = (state = scheduleStore, action) => {
  let store = Object.assign({}, state);
  switch (action.type) {
    case SCHEDULE_INIT_STORE: {
      store = Object.assign({}, scheduleStore);
      return store;
    }
    case SCHEDULE_QUERY_SCHEDULES_BEGIN: {
      store.scheduleList = [];
      store.tableLoading = true;
      return store;
    }
    case SCHEDULE_QUERY_SCHEDULES_SUC: {
      const data = action.data;
      store.scheduleList = data.list;
      store.tableLoading = false;
      return store;
    }
    //TODO 需要有default返回返回旧的state
    default: {
      return state
    }
  }
};
