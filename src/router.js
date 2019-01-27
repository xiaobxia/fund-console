import React from 'react'
import Bundle from './components/bundle'
import Login from 'Bundle-loader?lazy!localRoutes/User/Login'
import Register from 'Bundle-loader?lazy!localRoutes/User/Register'
import RegisterResult from 'Bundle-loader?lazy!localRoutes/User/RegisterResult'
import UserActive from 'Bundle-loader?lazy!localRoutes/Active'
import Dashboard from 'Bundle-loader?lazy!localRoutes/Dashboard'
import MyFund from 'Bundle-loader?lazy!localRoutes/MyFund'
import Fund from 'Bundle-loader?lazy!localRoutes/Fund'
import Schedule from 'Bundle-loader?lazy!localRoutes/Schedule'
import MyNetValue from 'Bundle-loader?lazy!localRoutes/MyNetValue'
import MyAsset from 'Bundle-loader?lazy!localRoutes/MyAsset'
import IndexInfoXiong from 'Bundle-loader?lazy!localRoutes/IndexInfoXiong'
import IndexInfoJian from 'Bundle-loader?lazy!localRoutes/IndexInfoJian'
import IndexDifference from 'Bundle-loader?lazy!localRoutes/IndexDifference'
import FixedInvestment from 'Bundle-loader?lazy!localRoutes/FixedInvestment'
import ChangeMarket from 'Bundle-loader?lazy!localRoutes/ChangeMarket'
import Chart from 'Bundle-loader?lazy!localRoutes/Chart'

//router4就得以这种方式懒加载
//其实model不需要按需加载，因为本来就不应该太大，应该由组件自己维护状态
let getComponent = (component) => {
  return (props) => {
    return (
      <Bundle load={component}>
        {(Container) => {
          return (<Container {...props}/>);
        }}
      </Bundle>
    );
  }
};
export const authRoutes = [
  {
    name: 'Login',
    path: '/user/login',
    component: getComponent(Login)
  },
  {
    name: 'Register',
    path: '/user/register',
    component: getComponent(Register)
  },
  {
    name: 'RegisterResult',
    path: '/user/registerResult',
    component: getComponent(RegisterResult)
  },
  {
    name: 'UserActive',
    path: '/user/active',
    component: getComponent(UserActive)
  }
];

export const baseRoutes = [
  {
    name: 'Dashboard Home',
    path: '/',
    component: getComponent(Dashboard)
  },
  {
    name: 'MyFund',
    path: '/myFund',
    component: getComponent(MyFund)
  },
  {
    name: 'Fund',
    path: '/fund',
    component: getComponent(Fund)
  },
  {
    name: 'Schedule',
    path: '/schedule',
    component: getComponent(Schedule)
  },
  {
    name: 'MyNetValue',
    path: '/myNetValue',
    component: getComponent(MyNetValue)
  },
  {
    name: 'MyAsset',
    path: '/myAsset',
    component: getComponent(MyAsset)
  },
  {
    name: 'IndexInfoXiong',
    path: '/indexInfoXiong',
    component: getComponent(IndexInfoXiong)
  },
  {
    name: 'IndexDifference',
    path: '/indexDifference',
    component: getComponent(IndexDifference)
  },
  {
    name: 'IndexInfoJian',
    path: '/indexInfoJian',
    component: getComponent(IndexInfoJian)
  },
  {
    name: 'ChangeMarket',
    path: '/changeMarket',
    component: getComponent(ChangeMarket)
  },
  {
    name: 'Chart',
    path: '/chart',
    component: getComponent(Chart)
  },
  {
    name: 'FixedInvestment',
    path: '/fixedInvestment',
    component: getComponent(FixedInvestment)
  }
];

export const menusInfos = [
  {
    key: 'home',
    pathname: '/',
    title: '主页',
    icon: 'home'
  },
  {
    key: 'schedule',
    pathname: '/schedule',
    title: '定时任务',
    icon: 'schedule'
  },
  {
    key: 'chart',
    pathname: '/chart',
    title: '图表测试',
    icon: 'chart'
  },
  {
    key: 'index',
    title: '指数',
    icon: 'line-chart',
    children: [
      {
        pathname: '/indexInfoXiong',
        title: '指数分析-熊'
      },
      {
        pathname: '/indexInfoJian',
        title: '指数分析-简'
      },
      {
        pathname: '/indexDifference',
        title: '指数差分析'
      },
      {
        pathname: '/changeMarket',
        title: '变盘策略'
      },
      {
        pathname: '/fixedInvestment',
        title: '定投策略'
      }
    ]
  },
  {
    key: 'fund',
    title: '基金',
    icon: 'pay-circle',
    children: [
      // {
      //   pathname: '/myAsset',
      //   title: '我的资产'
      // },
      {
        pathname: '/myFund',
        title: '基金持仓'
      },
      {
        pathname: '/fund',
        title: '基金库'
      },
      // {
      //   title: '策略',
      //   pathname: '/strategy'
      // },
      // {
      //   title: '低费率基金',
      //   pathname: '/lowRateFund'
      // },
      // {
      //   title: '我的关注',
      //   pathname: '/focusFund'
      // },
      {
        pathname: '/myNetValue',
        title: '我的净值'
      }
    ]
  }
];
export function getOpenKeyAndMainPath(pathname) {
  // /a/edit和/a/add是一样的
  const currentPathName = '/' + pathname.split('/')[1];
  for (let j = 0; j < menusInfos.length; j++) {
    const children = menusInfos[j].children;
    if (children) {
      for (let i = 0; i < children.length; i++) {
        if (children[i].pathname === currentPathName) {
          return {
            mainPath: currentPathName,
            openKey: menusInfos[j].key,
            title: children[i].title
          };
        }
      }
    } else {
      if (menusInfos[j].pathname === currentPathName) {
        return {
          mainPath: currentPathName,
          openKey: menusInfos[j].key,
          title: menusInfos[j].title
        };
      }
    }
  }
  return {};
}

