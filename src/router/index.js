import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

// 都有的路由
export const constantRouterMap = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
    meta: {
      auth: false
    }
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/authredirect'),
    hidden: true,
    meta: {
      auth: false
    }
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '主页', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/yearLine',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/yearLine/index'),
        name: 'YearLine',
        meta: { title: '年线-局部', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/yearLineAll',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/yearLineAll/index'),
        name: 'YearLineAll',
        meta: { title: '年线', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/halfYearLine',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/halfYearLine/index'),
        name: 'HalfYearLine',
        meta: { title: '半年线-局部', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/halfYearLineAll',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/halfYearLineAll/index'),
        name: 'HalfYearLineAll',
        meta: { title: '半年线', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/monthLine',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/monthLine/index'),
        name: 'MonthLine',
        meta: { title: '月线-局部', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/monthLineAll',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/monthLineAll/index'),
        name: 'MonthLineAll',
        meta: { title: '月线', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  { path: '*', redirect: '/404', hidden: true }
]
