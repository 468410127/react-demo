### 创建 easyapi

```ts
import adapter from '@pro/adapter';

interface CustomConfig {
  // 请求适配器配置项
  requsetAdapter:
    | Record<string, any>
    | ((sendData, adapter) => Record<string, any>);

  // 成功响应适配器
  responseAdapter:
    | Record<string, any>
    | ((bizData, adapter) => Record<string, any>);

  // 是否阻止默认错误处理
  preventDefaultError: boolean;

  // 是否启用在线mock
  easymock: boolean;
}

const api = esayapi<CustomConfig>({
  // 运行环境，同NODE_ENV
  env: 'production',

  // axios配置参数，具体参数请参考：https://github.com/axios/axios
  axios: {
    // 接口基础路径
    baseURL: '',
  },

  // 接口配置项
  configs: {
    //..
  },

  // 请求拦截器
  request(context) {
    const { config } = context;
    const { requestAdapter, easymock, url } = config;

    // 请求适配器
    if (typeof requestAdapter === 'function') {
      context.sendData = requestAdapter(context.sendData, adapter);
    } else if (requestAdapter && typeof requestAdapter === 'object') {
      context.sendData = adapter(requestAdapter, context.sendData);
    }

    // 开启连接在线mock接口
    if (
      env === 'development' &&
      easymock === true &&
      !/^\/?mockapi\//.test(url)
    ) {
      config.url = `/mockapi/${url}`.replace(/\/+/g, '/');
    }

    // 加登录状态token
    if (authorization) {
      context.headers.authorization = authorization;
    }
  },

  // 响应拦截器
  response(context) {
    const { responseObject } = context;

    // 二进制数据，不对响应数据进行处理
    if (responseObject.responseType === 'arraybuffer') {
      return;
    }

    // 对响应的数据做处理
    const { data, headers } = responseObject;
    const { code } = data;

    // 储存鉴权码
    if (headers?.authorization) {
      authorization = headers.authorization;
    }

    // 未登录
    if (code === 1008) {
      throw Error('NO-LOGIN');
    }

    // 其他错误
    if (code !== 200 && code !== 0) {
      throw Error(data.message || data.msg);
    }
  },

  // 成功响应拦截器
  success(context) {
    const { config, responseObject } = context;
    const { data } = responseObject;
    const { responseAdapter } = config;

    // 业务数据进行适配转化
    const bizData = data.data || data.resData;
    if (bizData) {
      if (typeof responseAdapter === 'function') {
        data.data = responseAdapter(bizData, adapter);
      } else if (responseAdapter && typeof responseAdapter === 'object') {
        data.data = adapter(responseAdapter, bizData);
      }
    }
  },

  // 错误响应拦截器
  failure(context) {
    const { config, error } = context;

    // 阻止默认的错误处理
    if (config.preventDefaultError) {
      return;
    }

    // 登录失败的错误处理
    if (error.message === 'NO-LOGIN') {
      return window.alert('登录失效');
    }

    // 常规的错误处理，显示错误信息
    console.error(error.message.substr(0, 100));
    // message.error(config.error.message.substr(0, 100));
  },
});
```
