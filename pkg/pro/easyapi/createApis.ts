import callRequest from './callRequest';

import { EasyapiConfig, EasyapiConfigs, Runtime } from './typings';

// 配置的唯一码
let uuid = 0;
// 创建导出的接口
function createApis<CustomConfig>(
  configs: EasyapiConfigs<CustomConfig>,
  keys: Array<any>,
  runtime: Runtime<CustomConfig>
) {
  // 当前配置项存在字符串类型的url字段，则配置项为接口配置项，否则为模块配置项
  if (typeof configs.url === 'string') {
    const config: any = Object.freeze({ ...configs, uuid: ++uuid });

    // 开发模式下会触发配置项校验
    if (runtime.isDevelopment) {
      validateConfig(config, keys);
    }

    return (...args) => {
      try {
        return callRequest<CustomConfig>(runtime, config, ...args);
      } catch (err) {
        return Promise.reject(err);
      }
    };
  }
  const { apiDefineCaches } = runtime;

  // 模块配置项，走代理模式
  return new Proxy(configs, {
    get(origin, key) {
      const fullKeys = keys.concat(key);
      const fullKeysText = fullKeys.join('#');

      // 已经生成了API配置项
      if (apiDefineCaches[fullKeysText]) {
        return apiDefineCaches[fullKeysText];
      }

      // 初始化API配置项
      if (origin[key]) {
        return (apiDefineCaches[fullKeysText] = createApis(
          origin[key],
          fullKeys,
          runtime
        ));
      }

      // 配置项未定义
      throw Error(`API配置“${keys.concat(key).join('.')}”未定义`);
    },
    set(origin, key) {
      throw Error(`API配置“${keys.concat(key).join('.')}”不允许重写`);
    },
    deleteProperty(origin, key) {
      throw Error(`API配置“${keys.concat(key).join('.')}”不允许删除`);
    },
  });
}

// 校验配置项是否正确
function validateConfig({ mock }: any, keys: Array<string>) {
  if (mock && typeof mock !== 'function') {
    return console.error(`API配置“${keys.join('.')}”的字段mock不为Function`);
  }
}

export default createApis;
