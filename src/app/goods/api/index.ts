// import mockJSON from '@pkg/util/mock-json';

import { IConfigs } from '@/api/index.types';

const configs: IConfigs = {
  namespace: 'goods',

  categories: {
    url: 'categories',
    delay: 100,
  },

  items: {
    url: 'items',
  },

  item: {
    url: 'item/:id',
  },
};

export default configs;
