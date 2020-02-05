import { getToken } from '@/utils/auth'
import Http from '@/utils/httpUtil'
import md5 from 'md5'
import storageUtil from '@/utils/storageUtil'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    }
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return Http.postJson('auth/login', {
        account: username,
        password: md5(userInfo.password)
      }).then((data) => {
        window._token = data.data.token
        localStorage.setItem('token', data.data.token)
        storageUtil.setData('userInfo', {
          ...data.data,
          isLogin: true
        })
        return data.data
      })
    },

    CheckLogin({ commit }, userInfo) {
    },
    // 登出
    LogOut() {
      return Http.get('auth/logout', {
        token: localStorage.getItem('token'),
        platform: 'mobile'
      }).then(() => {
        localStorage.removeItem('token')
        storageUtil.setData('userInfo', {
          isLogin: false
        })
      })
    }
  }
}

export default user
