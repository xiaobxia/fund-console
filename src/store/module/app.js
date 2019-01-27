/**
 * Created by xiaobxia on 2017/10/19.
 */
import md5 from 'md5';
import http from 'localUtil/httpUtil';
const APP_TOGGLE_COLLAPSED = 'APP_TOGGLE_COLLAPSED';
const APP_LOGIN = 'APP_LOGIN';
const APP_LOGIN_SUC = 'APP_LOGIN_SUC';
const APP_INSET_LOGIN = 'APP_INSET_LOGIN';
const APP_INSET_LOGIN_SUC = 'APP_INSET_LOGIN_SUC';
const APP_CHECK_LOGIN = 'APP_CHECK_LOGIN';
const APP_CHECK_LOGIN_SUC = 'APP_CHECK_LOGIN_SUC';
const APP_LOGOUT_SUC = 'APP_LOGOUT_SUC';
const APP_SHOW_GLOB_LOGIN = 'APP_SHOW_GLOB_LOGIN';
const APP_HIDE_GLOB_LOGIN = 'APP_HIDE_GLOB_LOGIN';

const platform = (function detectmob() {
  const userAgent = navigator.userAgent;
  if (userAgent.match(/Android/i) ||
    userAgent.match(/webOS/i) ||
    userAgent.match(/iPhone/i) ||
    userAgent.match(/iPad/i) ||
    userAgent.match(/iPod/i) ||
    userAgent.match(/BlackBerry/i) ||
    userAgent.match(/Windows Phone/i)
  ) {
    return 'mobile';
  } else {
    return 'pc';
  }
})();
// 全局token
window._token = '';

export const appActions = {
  appToggleCollapsed() {
    return {type: APP_TOGGLE_COLLAPSED};
  },
  appCheckLogin() {
    const token = localStorage.getItem('token') || '';
    return (dispatch, getState) => {
      dispatch({type: APP_CHECK_LOGIN});
      return http.get('auth/checkLogin', {token}).then((data) => {
        window._token = data.data.token;
        dispatch({type: APP_CHECK_LOGIN_SUC, loginUser: data.data});
      });
    };
  },
  appLogin({user, password}) {
    return (dispatch, getState) => {
      dispatch({type: APP_LOGIN});
      return http.post('auth/login', {account: user, password: md5(password), platform}).then((data) => {
        // if (data.login === true) {
        //   dispatch({type: APP_LOGIN_SUC, loginUser: data});
        // }
        window._token = data.data.token;
        localStorage.setItem('token', data.data.token);
        return data;
      });
    };
  },
  appInsetLogin({user, password}) {
    return (dispatch, getState) => {
      //内部登录，减少状态变化
      return http.post('sys/auth/login', {account: user, password: md5(password)}).then((data) => {
        dispatch({type: APP_INSET_LOGIN_SUC, loginUser: data});
      });
    };
  },
  appLogout() {
    return (dispatch, getState) => {
      return http.get('auth/logout', {platform, token: window._token}).then((res) => {
        localStorage.removeItem('token');
        dispatch({type: APP_LOGOUT_SUC});
      });
    };
  },
  appHideGlobLogin() {
    return {
      type: 'APP_HIDE_GLOB_LOGIN'
    }
  }
};

const appStore = {
  loginUser: {},
  isGlobLoading: false,
  showGlobLogin: false,
  collapsed: localStorage.getItem('collapsed') === 'true'
};
export const appReducers = (state = appStore, action) => {
  let data = Object.assign({}, state);
  switch (action.type) {
    case APP_TOGGLE_COLLAPSED: {
      data.collapsed = !data.collapsed;
      if (data.collapsed) {
        localStorage.setItem('collapsed', 'true');
      } else {
        localStorage.removeItem('collapsed');
      }
      return data;
    }
    case APP_CHECK_LOGIN: {
      data.loginUser = {};
      data.isGlobLoading = true;
      return data;
    }
    case APP_CHECK_LOGIN_SUC: {
      data.isGlobLoading = false;
      if (action.loginUser.isLogin === true) {
        data.loginUser = action.loginUser;
      } else {
        data.loginUser = {
          isLogin: false
        }
      }
      return data;
    }
    case APP_LOGIN: {
      data.loginUser = {};
      return data;
    }
    case APP_LOGIN_SUC: {
      data.loginUser = action.loginUser;
      //登录页登录的初始化，内部登录不需要
      data.collapsed = false;
      localStorage.removeItem('collapsed');
      return data;
    }
    case APP_INSET_LOGIN_SUC: {
      data.loginUser = action.loginUser;
      return data;
    }
    case APP_LOGOUT_SUC: {
      data.loginUser = {
        isLogin: false
      };
      return data;
    }
    case APP_SHOW_GLOB_LOGIN: {
      data.showGlobLogin = true;
      return data;
    }
    case APP_HIDE_GLOB_LOGIN: {
      data.showGlobLogin = false;
      return data;
    }
    //TODO 需要有default返回返回旧的state
    default: {
      return state
    }
  }
};
