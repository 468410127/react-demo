import { AxiosInstance } from 'axios';
import RequestContext from './RequestContext';
import Easyapi from './Easyapi';

// 组件配置项
interface EasyapiOption<CustomConfig, IContext = RequestContext<CustomConfig>> {
  // 运行环境
  env?: 'development' | 'production';

  // axios配置项
  axios?: any;

  // 接口配置项
  logger?: SystemConfig['logger'];

  // 缓存控制
  cache?: AllSystemConfig<CustomConfig>['cache'];

  configs: EasyapiConfigs<CustomConfig>;

  // 转化resolve的数据
  resolve: (responseObject) => any;

  // 事件钩子
  request?: (context: IContext) => void;
  response?: (context: IContext) => void;
  success?: (context: IContext) => void;
  failure?: (context: IContext) => void;
}

type EasyapiConfig<CustomConfig> = AllSystemConfig<CustomConfig> & CustomConfig;

type EasyapiConfigs<CustomConfig> =
  | EasyapiConfig<CustomConfig>
  | {
      [k: string]: EasyapiConfigs<CustomConfig>;
    };

// 运行环境变量
interface Runtime<CustomConfig> {
  // 是否处于开发模式
  isDevelopment: boolean;

  self: Easyapi<CustomConfig>;

  // 拦截器
  handlers: {
    request: EasyapiOption<CustomConfig>['request'];
    response: EasyapiOption<CustomConfig>['response'];
    success: EasyapiOption<CustomConfig>['success'];
    failure: EasyapiOption<CustomConfig>['failure'];
  };

  // 通用配置项
  apiConfig: {
    // 日志控制
    logger: SystemConfig['logger'];

    // axios配置项
    axios: EasyapiOption<CustomConfig>['axios'];

    // 缓存配置
    cache: EasyapiOption<CustomConfig>['cache'];
  };

  // 接口声明定义缓存
  apiDefineCaches: {
    [k: string]: EasyapiConfig<CustomConfig>;
  };

  // 接口缓存结果
  apiResultCaches: {
    [k: string]: any;
  };

  // axios实例对象
  axiosInstance: AxiosInstance;

  [k: string]: any;
}

// 系统内置的配置项
interface SystemConfig {
  // 唯一码
  uuid?: number;

  // 接口地址
  url: string;

  // 接口描述
  label?: string;

  // 是否开启日志输出
  logger?: boolean;

  // 请求方法
  method?: 'get' | 'post' | 'options' | 'delete' | 'head' | 'put';

  // 请求头
  headers?: Record<string, string>;

  // 是否忽略错误
  ignoreError?: boolean;

  // 接口延迟响应
  delay?: number;
}

// 系统所有的配置项，存在泛型依赖
interface AllSystemConfig<CustomConfig> extends SystemConfig {
  // 缓存策略配置项

  /// kkakslak
  cache?:
    | boolean
    | {
        // 缓存有效时间
        maxAge?: number;

        // 失效判断
        expire?: (context?: RequestContext<CustomConfig>) => any;
      }
    | ((context?: RequestContext<CustomConfig>) => any);

  // 模拟数据
  mock?: (context: RequestContext<CustomConfig>) =>
    | {
        $header?: Record<string, string>;
        $body?: Record<string, any>;
      }
    | Record<string, any>;

  // 响应数据处理器
  resolve?: (
    responseObject: RequestContext<CustomConfig>['responseObject']
  ) => any;
}

export {
  EasyapiOption,
  EasyapiConfigs,
  EasyapiConfig,
  AllSystemConfig,
  Runtime,
  RequestContext,
};
