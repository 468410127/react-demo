import axiosLib, { AxiosRequestConfig } from 'axios';
import defaults from './config/defaults';
import { EasyapiConfig, Runtime } from './typings';

const { CancelToken } = axiosLib;

// 请求上下文环境
class RequestContext<CustomConfig> {
  // 请求配置项
  config: EasyapiConfig<CustomConfig> & {
    params: Record<string, any>;
    cacheMaxAge?: number;
    cacheExpire?: (context: RequestContext<CustomConfig>) => any;
  };

  sendData: any;

  runtime: Runtime<CustomConfig>;

  error: Error;

  responseObject: any;

  constructor({
    runtime,
    shareConfig,
    privateConfig,
    sendData,
  }: {
    runtime: Runtime<CustomConfig>;
    shareConfig: EasyapiConfig<CustomConfig>;
    privateConfig?: EasyapiConfig<CustomConfig>;
    sendData?: any;
  }) {
    this.runtime = runtime;

    const config = {
      ...defaults.axios,
      ...defaults.easyapi,
      ...runtime.rest,
      logger: runtime.apiConfig.logger,
      ...shareConfig,
      ...privateConfig,
      headers: {
        ...shareConfig.headers,
        ...privateConfig.headers,
      },
    };

    config.method = (config.method || defaults.axios.method).toUpperCase(); // 请求方式

    this.config = config;

    const { cache } = config;

    let expire;
    let maxAge;
    if (typeof cache === 'function') {
      expire = cache;
    } else if (typeof cache === 'object') {
      ({ expire, maxAge } = cache);
    } else {
      expire = maxAge = null;
    }

    config.cacheMaxAge = maxAge;
    config.cacheExpire = expire;

    // this.state = 0 // 0:INIT, 1:RESPONSE, 2:RESOLVE, 3:REJECT, 4:FINNALY, 6:RESOLVEDATA
    this.sendData = sendData;
    this.error = null;
    this.responseObject = null;

    // 放入取消请求的钩子
    const { abort } = config;
    if (abort && typeof abort === 'object') {
      const source = CancelToken.source();
      config.cancelToken = source.token;
      abort.trigger = (message) => {
        source.cancel(message);
      };
    }
    // console.info(this);
  }

  // 获取axios配置
  axios(): AxiosRequestConfig {
    let data = null;
    let params = null;

    const { sendData, config } = this;

    if (/^GET$/i.test(config.method)) {
      params = sendData;
    } else if (/^(POST|PUT)$/i.test(config.method)) {
      data = sendData;
    }

    return {
      ...config,
      data,
      params: {
        ...config.params,
        ...params,
      },
    };
  }

  // 等待缓存结果
  waitForCacheResult() {
    const { runtime, config } = this;
    const { apiResultCaches } = runtime;

    // 无缓存策略
    if (!config.cache) {
      return;
    }

    // 初始化缓存对象
    let cacheResults = apiResultCaches[config.uuid];
    if (!cacheResults) {
      cacheResults = apiResultCaches[config.uuid] = {};
    }

    // 初始化缓存数据
    const cacheKey = JSON.stringify(this.sendData);
    let cacheResult = cacheResults[cacheKey];
    if (!cacheResult) {
      cacheResult = cacheResults[cacheKey] = {
        state: 'Pending',
      };
    }

    // 直接缓存中返回
    if (cacheResult.state === 'Done') {
      // 尚未过期
      if (notExpire()) {
        cacheResult.activityTime = Date.now();
        return cacheResult.result;
      }

      // 已过期
      cacheResult.state = 'Pending';
    }

    // 插入到等待队列
    if (cacheResult.state === 'Loading') {
      return new Promise((resolve) => {
        cacheResult.waits.push((result) => {
          resolve(result);
        });
      });
    }

    // 设置为加载中
    if (cacheResult.state === 'Pending') {
      cacheResult.waits = [];
      cacheResult.state = 'Loading';
    }

    // console.info('cacheResult', this);

    function notExpire() {
      const { cache } = config;

      if (cache === true) {
        return true;
      }

      const { cacheMaxAge, cacheExpire } = config;

      // 缓存已经超时过期
      if (cacheMaxAge && Date.now() - cacheResult.activityTime > cacheMaxAge) {
        return false;
      }

      // 判断上一次的缓存状态
      if (cacheExpire && cacheExpire(this) !== cacheResult.expireValue) {
        return false;
      }

      return true;
    }
  }

  // 触发缓存响应
  dispatchCacheResult(result) {
    const { config } = this;
    if (!config.cache) {
      return;
    }
    const cacheKey = JSON.stringify(this.sendData);
    const { apiResultCaches } = this.runtime;

    const cacheResult = apiResultCaches[config.uuid][cacheKey];

    cacheResult.state = 'Done';
    cacheResult.result = result;
    cacheResult.activityTime = Date.now();
    cacheResult.expireValue = config.cacheExpire
      ? config.cacheExpire(this)
      : null;

    // 失败的情况下设置缓存状态为pending
    result.catch(() => {
      cacheResult.state = 'Pending';
    });

    let current;
    while ((current = cacheResult.waits.shift())) {
      current(result);
    }
  }
}

export default RequestContext;
