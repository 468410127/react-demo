import loadModules from '@pkg/util/load-modules';

import { IRoutesConfig } from '../index.types';

const children = loadModules(
  require.context('@/app', true, /\/route\/index\.ts$/)
).reduce((allRoutes, routes) => (allRoutes.push(...routes), allRoutes), []);

const routes: IRoutesConfig = [
  {
    layout: {
      header: true,
      sidebar: true,
      breadcrumb: false,
      styles: {
        pages: false,
      },
    },
    children,
  },
];

export default routes;
