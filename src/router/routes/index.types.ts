import { RouteConfig } from '@react-better/router/typings';

interface MyRouteConfig extends RouteConfig {
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

type MyRoutesConfig = Array<MyRouteConfig>;

export { MyRouteConfig as RouteConfig, MyRoutesConfig as RoutesConfig };
