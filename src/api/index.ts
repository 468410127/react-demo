import './adapter';

import { GatewayBasePath, NODE_ENV } from '@/config';

import configs from './config';
import Api from './config/index.types';
import setting from './setting';

const api: Api = setting({
  env: NODE_ENV,
  basePath: `${GatewayBasePath}api/`,
  configs,
});

const { basic, goods } = api;

export default api;
export { basic, goods };
