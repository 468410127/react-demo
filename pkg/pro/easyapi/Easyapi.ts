import axiosLib from 'axios';
import { EasyapiOption, Runtime } from './typings';
import defaults from './config/defaults';
import createApis from './createApis';

class Easyapi<CustomConfig> {
  apis: Record<string, any> = {};

  constructor(option: EasyapiOption<CustomConfig>) {
    const {
      // 是否开发环境
      env = 'production',
      logger = false,

      // 拦截器钩子
      // init,
      request,
      response,
      success,
      failure,

      // axios配置项
      axios,

      // 接口配置项
      configs = {},

      // 缓存策略配置项
      cache = false,

      // 剩余的其他配置项
      ...rest
    } = option;

    const runtime: Runtime<CustomConfig> = {
      isDevelopment: env !== 'production',
      self: this,
      handlers: {
        request,
        response,
        success,
        failure,
      },
      apiConfig: {
        logger,
        axios,
        cache,
      },
      apiDefineCaches: {},
      apiResultCaches: {},
      axiosInstance: axiosLib.create({ ...defaults.axios, ...axios }),
      rest,
    };

    this.apis = createApis<CustomConfig>(configs, [], runtime);
  }
}

export default Easyapi;
