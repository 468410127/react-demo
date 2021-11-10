import IgnoreErrorName from './config/IgnoreErrorName';
import RequestContext from './RequestContext';

function onResponse<CustomConfig>(
  asyncResponseObject,
  context: RequestContext<CustomConfig>
) {
  const { runtime, config } = context;
  const { logger } = config;
  const { isDevelopment } = runtime;
  const promise = new Promise((resolve, reject) => {
    // 开发模式下，模拟delay效果
    if (isDevelopment) {
      setTimeout(asyncResponseCall, config.delay || 0);
    } else {
      asyncResponseCall();
    }

    function asyncResponseCall() {
      const { response, success, failure } = runtime.handlers;
      asyncResponseObject
        .then((responseObject) => {
          context.responseObject = responseObject;
          if (typeof response === 'function') {
            response(context);
          }

          if (typeof success === 'function') {
            success(context);
          }

          if (isDevelopment && logger) {
            console.warn('=== easyapi.response ===\n', { context });
          }
          resolve(context.responseObject);
        })
        .catch((error) => {
          try {
            if (typeof failure === 'function') {
              context.error = error;
              failure(context);
              return reject(context.error);
            }
            reject(error);
          } catch (error) {
            reject(error);
          } finally {
            if (isDevelopment && logger) {
              console.warn('=== easyapi.error ===\n', { context });
            }
          }
        });
    }
  });

  let nextPromise = promise;
  // 忽略错误
  if (config.ignoreError) {
    nextPromise = nextPromise.catch((error) => {
      error.name = IgnoreErrorName;
      throw error;
    });
  }

  const result = nextPromise.then((responseObject) =>
    config.resolve ? config.resolve(responseObject) : responseObject
  );

  context.dispatchCacheResult(result);

  return result;
}

export default onResponse;
