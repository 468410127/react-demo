import {
  EasyapiConfigs,
  RequestContext,
} from '@pkg/pro/easyapi/typings';

type Context = RequestContext<CustomConfig>;

export interface CustomConfig {
  // 请求适配器配置项
  requestAdapter?:
    | Record<string, any>
    | ((sendData, adapter) => Record<string, any>);

  // 成功响应适配器
  responseAdapter?:
    | Record<string, any>
    | ((bizData, adapter) => Record<string, any>);

  // 是否阻止默认错误处理
  preventDefaultError?: boolean;

  // 是否启用在线mock
  easymock?: boolean;

  // 快速mock
  mockjson?: string;

  // 是否显示成功反馈
  showSuccess?: boolean | string;

  beforeRequest?: (context: Context) => any;

  beforeResponse?: (context: Context) => any;
}

export type Configs = EasyapiConfigs<CustomConfig> & {
  create?: Configs;
  delete?: Configs;
  modify?: Configs;
  detail?: Configs;
  list?: Configs;
};

export type IConfigs = {
  namespace: string;
  [k: string]: Configs | string;
};
