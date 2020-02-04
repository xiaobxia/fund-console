import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import storageUtil from '@/utils/storageUtil'

NProgress.configure({ showSpinner: false })

router.beforeEach((to, from, next) => {
  NProgress.start()
  console.log('beforeEach')
  console.log(from)
  console.log(to)
  const userInfo = storageUtil.getData('userInfo')
  // 和移动端不一样，管理后台所有东西都得是先登录才能用
  if (userInfo.isLogin === true) {
    // 登入了还去登录，直接转首页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // 没有生成过
      if (store.getters.ifAddRouters) {
        next()
      } else {
        store.dispatch('generateRoutes', { roles: userInfo.roles }).then(() => {
          console.log('生成菜单')
          // router里面原本只有基础的路由，是后来添加的有权限的路由
          router.addRoutes(store.getters.addRouters)
          next({ ...to, replace: true })
        })
      }
      // 没有必要检查了，没有的会直接404
      // if (permissionUtil.checkPermission(userInfo.roles, to)) {
      // } else {
      //   next({ path: '/401', replace: true, query: { noGoBack: true }})
      // }
    }
  } else {
    // 直接进入
    if (to.meta && to.meta.auth === false) {
      next()
    } else {
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach((to, from) => {
  console.log('afterEach')
  console.log(from)
  console.log(to)
  NProgress.done() // finish progress bar
})
