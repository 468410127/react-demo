import { MatchFunction } from 'path-to-regexp';
import Router from './Router';

type KeyValue = Record<string, string>;

// 路由组配置项
type RoutesConfig = Array<RouteConfig>;

type MyLinkProps = {
  to:
    | string
    | {
        pathname: string;
        search?: string;
        query?: Record<string, any>;
        hash?: string;
        state?: Record<string, any>;
      }
    | ((location: any) => any);
  replace?: boolean;
  innerRef?: any;
  component?: React.Component;
  others?: any;
  children?: JSX.Element | string | Array<JSX.Element | string>;
};

// 创建路由对象的配置项
interface RouterOption {
  // 基础路径
  basePath?: string;

  // 布局组件
  Layout?: (props) => JSX.Element;

  // 等待的组件
  Spin?: any;

  // 路由配置项
  routes: RoutesConfig;

  // 初始化
  onReady: (props) => void;

  // 路由进入
  onEnter: (router: Router) => JSX.Element | void;
}

// 路由信息
interface RouterRoute {
  // 路由地址
  path: string;

  // 路由布局配置
  layout: LayoutConfig;

  // 页面标题
  title?: string | ((route: RouterRoute) => string);

  // 路由路径参数
  params: KeyValue;

  // 路由查询参数
  query: KeyValue;
}

// 标准化的路由配置项
interface RouterRouteConfig {
  layout?: RouteConfig['layout'];
  path?: string;
  redirect?: RouteConfig['redirect'];
  title?: RouteConfig['title'];
  navTitle?: RouteConfig['navTitle'];
  lazy?: RouteConfig['lazy'];
  loginIgnore?: RouteConfig['loginIgnore'];
  authIgnore?: RouteConfig['authIgnore'];
  auths?: RouteConfig['auths'];
  icon?: RouteConfig['icon'];
  isPage?: boolean;

  // 路由路径匹配
  pathMatch?: (path: string) => any;

  // 路由缓存路径匹配
  keepAliveMatchs?: Array<MatchFunction>;

  // 路由视图
  RouteView?: React.FC;

  // 组件是否已加载就绪
  isLoaded?: boolean;
}

interface RouterMenuRouteConfig {
  // 菜单文案
  title: string;

  // 路由完整地址
  path: string;

  // 菜单图标
  icon?: RouteConfig['icon'];

  // 菜单链接地址
  href?: string;

  // 菜单是跳转target
  target?: string;

  auths: RouteConfig['auths'];

  children?: Array<RouterMenuRouteConfig>;

  authIgnore?: boolean;

  // 是否是页面路由配置
  isPage: boolean;
}

// 路由配置项
interface RouteConfig {
  // 路由路径
  path?: string;

  // 路由同步页面
  page?: React.FC;

  // 路由异步页面
  lazy?: () => Promise<{ default: any }>;

  // 自定义路由渲染
  render?: () => JSX.Element;

  // 登录忽略
  loginIgnore?: boolean;

  // 权限忽略
  authIgnore?: boolean;

  // 菜单图标标识
  icon?: string;

  // 权限因子列表
  auths?: Array<string>;

  // 路由菜单文案，假如没有配置则不在菜单中显示
  menuTitle?: string;

  // 导航的文案
  navTitle?: string;

  // 布局配置
  layout?: LayoutConfig;

  // 页面标题
  title?: string | ((route: RouterRoute) => string); // 标题

  // 子路由组配置项
  children?: RoutesConfig;

  // 路由跳转配置项
  redirect?: string | { query: boolean; path: string } | ((auery) => string);

  // 路由缓存，将目标地址配置，则跳转之前会缓存当前页面
  keepAlive?: Array<string>;
}

// 通用布局配置
interface LayoutConfig {
  // 头
  header?: boolean;

  // 侧边
  sidebar?: boolean;

  // 面包屑
  breadcrumb?: boolean;

  // 样式的控制
  styles?: Record<string, any>;
}

export {
  RouterOption,
  RouterRouteConfig,
  RouterMenuRouteConfig,
  RouterRoute,
  RouteConfig,
  KeyValue,
  MyLinkProps,
};
