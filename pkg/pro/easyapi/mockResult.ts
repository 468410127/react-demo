import onResponse from './onResponse';
import RequestContext from './RequestContext';

// 使用本地mock响应
function mockResult<Customcontext>(context: RequestContext<Customcontext>) {
  const { runtime, config } = context;

  // console.info('mockResult');

  // 生产模式，或者无mock配置项，则不执行mock数据
  if (!runtime.isDevelopment || !config.mock) {
    return;
  }

  const mockDataResult = new Promise((resolve, reject) => {
    const responseObject = config.mock(context);

    if (responseObject instanceof Promise) {
      responseObject
        .then((responseObject) => {
          resolveResponseObject(responseObject);
        })
        .catch(reject);
    } else {
      resolveResponseObject(responseObject);
    }

    function resolveResponseObject(responseObject: any = {}) {
      if (!responseObject || typeof responseObject !== 'object') {
        return resolve({
          data: responseObject,
          headers: {},
          context: context.config,
        });
      }

      const { $body, $headers } = responseObject;
      // 返回的即body
      if (!$body && !$headers) {
        return resolve({
          data: responseObject,
          headers: {},
          context: context.config,
        });
      }

      resolve({
        data: $body || null,
        headers: $headers || {},
        context: context.config,
      });
    }
  });

  return onResponse<Customcontext>(mockDataResult, context);
}

export default mockResult;
