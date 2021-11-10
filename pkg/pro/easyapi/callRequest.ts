import convertRESTful from './convertRESTful';
import cacheResult from './cacheResult';
import mockResult from './mockResult';
import httpResult from './httpResult';

import RequestContext from './RequestContext';
import { EasyapiConfig, Runtime } from './typings';

type Callback = () => void;
type SendData = Record<string, any> | null;

function callRequest<CustomConfig>(
  runtime: Runtime<CustomConfig>,
  shareConfig: EasyapiConfig<CustomConfig>,
  callback: Callback,
  privateConfig?: EasyapiConfig<CustomConfig>
): void;

function callRequest<CustomConfig>(
  runtime: Runtime<CustomConfig>,
  shareConfig: EasyapiConfig<CustomConfig>,
  sendData: SendData,
  callback: Callback,
  privateConfig?: EasyapiConfig<CustomConfig>
): void;

function callRequest<CustomConfig>(
  runtime: Runtime<CustomConfig>,
  shareConfig: EasyapiConfig<CustomConfig>,
  sendData?: SendData,
  privateConfig?: EasyapiConfig<CustomConfig>
): void;

function callRequest<CustomConfig>(...args) {
  let [, , sendData, callback, privateConfig] = args;

  const runtime: Runtime<CustomConfig> = args[0];
  const shareConfig: EasyapiConfig<CustomConfig> = args[1];

  // 由参数callback是否传入决定是callback模式还是Promise模式
  // sendData 由method决定是data还是params
  // sendData, callback
  // sendData, callback, privateConfig
  // sendData, privateConfig
  // sendData

  // 仅传了配置项，无callback，primise模式
  if (sendData == null && typeof callback === 'object') {
    privateConfig = callback;
    callback = null;
    sendData = null;
  }
  // 无sendData参数，回调模式
  else if (typeof sendData === 'function') {
    privateConfig = callback;
    callback = sendData;
    sendData = null;
  }
  // promis模式
  else if (typeof callback !== 'function') {
    privateConfig = callback;
    callback = null;
  }

  sendData = sendData || {};
  callback = callback || null;
  privateConfig = privateConfig || {};

  const context = new RequestContext({
    runtime,
    shareConfig,
    privateConfig,
    sendData,
  }); // 当前请求实例的配置项

  const { request } = runtime.handlers;

  // 请求拦截器中进行处理
  if (typeof request === 'function') {
    request(context);
  }

  // 转化restful路径中的参数
  convertRESTful<CustomConfig>(context);

  // 获取结果
  const asyncResult =
    cacheResult<CustomConfig>(context) ||
    mockResult<CustomConfig>(context) ||
    httpResult<CustomConfig>(context);

  // 返回promise模式
  if (!callback) {
    return asyncResult;
  }

  asyncResult
    .then((responseObject) => {
      callback(responseObject, null);
    })
    .catch((error) => {
      callback(null, error);
    });
}

export default callRequest;
