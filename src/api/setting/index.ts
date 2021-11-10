import { message } from 'antd';
import easyapi from '@pro/easyapi';
import adapter from '@pro/adapter';
import mockJSON from '@pkg/util/mock-json';
import { CustomConfig } from '../index.types';

// 鉴权码，使用headers进行传递
let authorization;

function setting({ env, basePath, configs }) {
  return easyapi<CustomConfig>({
    env,
    axios: {
      baseURL: basePath,
    },
    configs,
    // ignoreError: true,
    resolve: (responseObject) =>
      responseObject.data.data || responseObject.data.resData,

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
        context.runtime.isDevelopment &&
        easymock === true &&
        !/^\/?mockapi\//.test(url)
      ) {
        config.url = `/mockapi/${url}`.replace(/\/+/g, '/');
      }

      if (typeof config.mockjson === 'string') {
        config.mock = (context) => {
          return mockJSON(config.mockjson, context.sendData);
        };
      }

      // 加登录状态token
      if (authorization) {
        config.headers.authorization = authorization;
      }

      if (config.beforeRequest) {
        config.beforeRequest(context);
      }
    },

    // 响应拦截器
    response(context) {
      const { responseObject, config } = context;

      // 二进制数据，不对响应数据进行处理
      if (responseObject.responseType === 'arraybuffer') {
        return;
      }

      if (config.beforeResponse) {
        config.beforeResponse(context);
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
      const { responseAdapter, showSuccess } = config;

      // 业务数据进行适配转化
      const bizData = data.data || data.resData;

      if (typeof responseAdapter === 'function') {
        data.data = responseAdapter(bizData, adapter);
      } else if (responseAdapter && typeof responseAdapter === 'object') {
        data.data = adapter(responseAdapter, bizData);
      }

      if (showSuccess === true) {
        message.success('操作成功');
      } else if (typeof showSuccess === 'string') {
        message.success(showSuccess);
      }
    },

    // 错误响应拦截器
    failure(context) {
      const { config, error } = context;

      // 阻止默认的错误处理
      if (config.preventDefaultError) {
        return;
      }

      // 常规的错误处理，显示错误信息
      // console.error(error.message.substr(0, 100));
      message.error(context.error.message.substr(0, 100));
    },
  });
}

export default setting;
