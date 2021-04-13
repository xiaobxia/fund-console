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
    path: '/netValue',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/netValueChart/index'),
        name: 'NetValue',
        meta: { title: '净值', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/signal',
    component: Layout,
    meta: { title: '信号集合', icon: 'fas fa-tachometer-alt', noCache: true },
    children: [
      {
        path: 'jinian',
        component: () => import('@/views/signal/jinian'),
        name: 'jinian',
        meta: { title: '风险区', icon: 'fas fa-tachometer-alt', noCache: true }
      },
      {
        path: 'jiandi',
        component: () => import('@/views/signal/jiandi'),
        name: 'jiandi',
        meta: { title: '见底', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/yearLine',
    component: Layout,
    meta: { title: '年线', icon: 'fas fa-tachometer-alt', noCache: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/yearLine/index'),
        name: 'YearLine',
        meta: { title: '年线-局部', icon: 'fas fa-tachometer-alt', noCache: true }
      },
      {
        path: 'all',
        component: () => import('@/views/yearLineAll/index'),
        name: 'YearLineAll',
        meta: { title: '年线-整体', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/halfYearLine',
    component: Layout,
    meta: { title: '半年线', icon: 'fas fa-tachometer-alt', noCache: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/halfYearLine/index'),
        name: 'HalfYearLine',
        meta: { title: '半年线-局部', icon: 'fas fa-tachometer-alt', noCache: true }
      },
      {
        path: 'all',
        component: () => import('@/views/halfYearLineAll/index'),
        name: 'HalfYearLineAll',
        meta: { title: '半年线-整体', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/monthLine',
    component: Layout,
    meta: { title: '月线', icon: 'fas fa-tachometer-alt', noCache: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/monthLine/index'),
        name: 'MonthLine',
        meta: { title: '月线-局部', icon: 'fas fa-tachometer-alt', noCache: true }
      },
      {
        path: 'all',
        component: () => import('@/views/monthLineAll/index'),
        name: 'MonthLineAll',
        meta: { title: '月线-整体', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/quarterLine',
    component: Layout,
    meta: { title: '季度线', icon: 'fas fa-tachometer-alt', noCache: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/quarterLine/index'),
        name: 'QuarterLine',
        meta: { title: '季度线-局部', icon: 'fas fa-tachometer-alt', noCache: true }
      },
      {
        path: 'all',
        component: () => import('@/views/quarterLineAll/index'),
        name: 'QuarterLineAll',
        meta: { title: '季度线-整体', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/weekLine',
    component: Layout,
    meta: { title: '周线', icon: 'fas fa-tachometer-alt', noCache: true },
    children: [
      {
        path: 'index',
        component: () => import('@/views/weekLine/index'),
        name: 'QuarterLine',
        meta: { title: '周线-局部', icon: 'fas fa-tachometer-alt', noCache: true }
      },
      {
        path: 'all',
        component: () => import('@/views/weekLineAll/index'),
        name: 'QuarterLineAll',
        meta: { title: '周线-整体', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/weekDay',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/weekDay/index'),
        name: 'WeekDay',
        meta: { title: '周天统计', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/asPage',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/asPage/index'),
        name: 'AsPage',
        meta: { title: '分析页', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/fixChart',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/fixChart/index'),
        name: 'FixChart',
        meta: { title: '定投图', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/bandChart',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/bandChart/index'),
        name: 'BandChart',
        meta: { title: '波段图', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/rateLine',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/rateLine/index'),
        name: 'RateLine',
        meta: { title: '波动率图', icon: 'fas fa-tachometer-alt', noCache: true }
      }
    ]
  },
  {
    path: '/btbLineAll',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/btbLineAll/index'),
        name: 'BtbLineAll',
        meta: { title: '比特币图', icon: 'fas fa-tachometer-alt', noCache: true }
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
