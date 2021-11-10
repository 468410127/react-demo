import { IRoutesConfig } from '@/router/index.types'

const configs: IRoutesConfig = [
  { redirect: '/goods/list' },
  {
    path: 'goods',
    children: [
      {
        path: 'list',
        title: 'production list',
        lazy: () => import('../view/list'),
        keepAlive: ['/goods/detail/:id'],
      },
      {
        path: 'detail/:id',
        title: 'detail',
        lazy: () => import('../view/detail'),
      },
    ],
  },
]

export default configs
