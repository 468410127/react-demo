import { RouteConfig } from '@react-better/router/typings';

interface IRouteConfig extends RouteConfig {
  layout?: {
    header?: boolean;
    footer?: boolean;
    sidebar?: boolean;
    breadcrumb?: boolean;
    styles?: {
      pages: boolean;
    };
  };
  icon?: string;
  auths?: Array<string>;
}

type IRoutesConfig = Array<IRouteConfig>;

export { IRoutesConfig, IRouteConfig };
