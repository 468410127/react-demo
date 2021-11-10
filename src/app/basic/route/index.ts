import { IRoutesConfig } from '@/router/index.types';

const configs: IRoutesConfig = [
  // { redirect: '/home' },
  // { redirect: '/app/list' },
  {
    title: '首页',
    path: 'home',
    lazy: () => import('../view/home'),
  },
  {
    title: '页面不存在',
    path: 'page404',
    lazy: () => import('../view/page404'),
  },
  {
    title: '用户登录',
    path: 'login',
    lazy: () => import('../view/login'),
    loginIgnore: true,
    layout: {
      styles: {
        pages: false,
      },
    },
  },
  {
    title: '暂无访问权限',
    path: 'pageauth',
    lazy: () => import('../view/pageauth'),
  },
];

export default configs;
