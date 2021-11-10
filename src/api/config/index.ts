import loadModules from '@pkg/util/load-modules';

const configs = loadModules(
  require.context('@/app', true, /\/api\/index\.ts$/)
).reduce((allConfigs, configs) => {
  // 接口挂载到命名空间下
  const { namespace } = configs;
  if (!allConfigs[namespace]) {
    allConfigs[namespace] = {};
  }
  const apiContainer = allConfigs[namespace];

  Object.keys(configs).forEach((key) => {
    const config = configs[key];

    // 对象类型的为配置项
    if (typeof config === 'object') {
      apiContainer[key] = config;
    }
  });

  return allConfigs;
}, {});

export default configs;
