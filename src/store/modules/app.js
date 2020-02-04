import storageUtil from '@/utils/storageUtil'
let sidebarStatus = storageUtil.getData('appConfig', 'sidebarStatus')
if (sidebarStatus !== 1 && sidebarStatus !== 0) {
  sidebarStatus = 1
}
const app = {
  state: {
    sidebar: {
      opened: sidebarStatus === 1,
      withoutAnimation: false
    },
    device: 'desktop',
    language: storageUtil.getData('appConfig', 'language') || 'zh'
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        storageUtil.setData('appConfig', 'sidebarStatus', 0)
      } else {
        storageUtil.setData('appConfig', 'sidebarStatus', 1)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      storageUtil.setData('appConfig', 'sidebarStatus', 0)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    SET_LANGUAGE: (state, language) => {
      state.language = language
      storageUtil.setData('appConfig', 'language', language)
    },
    SET_SIZE: (state, size) => {
      state.size = size
      storageUtil.setData('appConfig', 'size', size)
    }
  },
  actions: {
    toggleSideBar({ commit }) {
      commit('TOGGLE_SIDEBAR')
    },
    closeSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    toggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    setLanguage({ commit }, language) {
      commit('SET_LANGUAGE', language)
    },
    setSize({ commit }, size) {
      commit('SET_SIZE', size)
    }
  }
}

export default app
