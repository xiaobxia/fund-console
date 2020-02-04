import { asyncRouterMap, constantRouterMap } from '@/router'
import permissionUtil from '@/utils/permission'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    ifAdd: false
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = routers.concat(constantRouterMap)
      state.ifAdd = true
    }
  },
  actions: {
    generateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        commit('SET_ROUTERS', permissionUtil.filterAsyncRouter(asyncRouterMap, roles))
        resolve()
      })
    },
    generateRoutesWithMenu({ commit }, data) {
      return new Promise(resolve => {
        const { menu } = data
        commit('SET_ROUTERS', permissionUtil.filterAsyncRouterWithMenu(asyncRouterMap, menu))
        resolve()
      })
    }
  }
}

export default permission
