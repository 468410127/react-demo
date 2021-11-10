import React, { memo, useEffect, useMemo, useState } from 'react';
import {
  Redirect,
  useHistory,
  Route,
  BrowserRouter,
  Link,
} from 'react-router-dom';
import { match } from 'path-to-regexp';
import { Input, Space, Spin } from 'antd';
import {
  KeyValue,
  RouterMenuRouteConfig,
  RouterOption,
  RouterRoute,
  RouterRouteConfig,
} from './typings';
import { queryStringify } from './helper';

class Router {
  // 控制更新的标识
  version: any;

  href: string;

  // 状态
  state: {
    // 是否就绪
    isReady: boolean;

    // 是否登录
    isLogin: boolean;

    // 路由加载中
    loading: boolean;

    RouterView?: () => JSX.Element;

    // 权限因子
    auths: Array<string>;

    // 菜单列表
    menuList: Array<RouterMenuRouteConfig>;

    // 面包屑导航配置
    navList: Array<{ title: string; path: string; isPage: boolean }>;
  };

  // 基础路径
  basePath: string;

  // 导出的路由信息
  route: RouterRoute;

  //  布局基座
  private Layout?: (props) => JSX.Element;

  // 加载器
  private Spin?: (props) => JSX.Element;

  // 设置路由对象就绪状态
  private onReady: () => void;

  // 路由拦截钩子
  private onEnter: RouterOption['onEnter'];

  // 触发更新
  private forceUpdate: (version: any) => void;

  // 静态路由配置项
  private staticRoutes: Record<string, RouterRouteConfig>;

  // 动态路由配置项
  private dynamicRoutes: Array<RouterRouteConfig>;

  // 缓存中的路由信息
  private keepAliveRoutes: Array<RouterRouteConfig>;

  // 所有待渲染的路由视图配置
  private viewRoutes: Array<RouterRouteConfig>;

  // 路由菜单配置项
  private menuRoutes: Array<RouterMenuRouteConfig>;

  // 激活的路由配置信息
  private matchedRoute: RouterRouteConfig;

  // 上一次激活的路由配置信息
  private matchedRoutePrev: RouterRouteConfig;

  constructor({
    Layout,
    Spin,
    routes,
    onReady,
    onEnter,
    basePath = '',
  }: RouterOption) {
    this.Layout = Layout;
    this.Spin = Spin;
    this.version = {};
    this.state = {
      isReady: false,
      loading: false,
      isLogin: false,
      auths: [],
      menuList: [],
      RouterView: () => null,
      navList: [],
    };
    this.basePath = basePath.replace(/\/$/g, '');
    this.onReady = () => onReady((state) => this.setReady(state));
    this.onEnter = onEnter;
    this.initRoutes(routes);
    this.updateRoute();
  }

  // 初始化路由配置信息
  private initRoutes(routes: RouterOption['routes']) {
    const staticRoutes: Router['staticRoutes'] = (this.staticRoutes = {});
    const dynamicRoutes: Router['dynamicRoutes'] = (this.dynamicRoutes = []);
    const menuRoutes: Router['menuRoutes'] = (this.menuRoutes = []);
    this.viewRoutes = [];
    this.keepAliveRoutes = [];

    const walkRoutes = (
      routes: RouterOption['routes'],
      paths: Array<string>,
      parentLayout: RouterRouteConfig['layout'],
      menuRoutes: Array<RouterMenuRouteConfig>
    ) => {
      routes.forEach((route) => {
        // 路由跳转
        const { path = '', layout, children } = route;
        const pathsNext = paths.concat([path]);
        // 路由全路径
        const pathsNextText = pathsNext
          .join('/')
          .replace(/\/+/g, '/')
          .replace(/(.)\/$/, '$1');

        const routeLayout = layout === null ? {} : layout || parentLayout;

        if (route.menuTitle) {
          menuRoutes.push({
            title: route.menuTitle,
            path: pathsNextText,
            icon: route.icon,
            authIgnore: route.authIgnore || !route.auths || false,
            auths: route.auths || [],
            isPage: !!(
              route.lazy ||
              route.render ||
              route.page ||
              route.redirect
            ),
          });
        }

        // 跳转的路由配置项，不在后续的逻辑
        const { redirect } = route;

        if (redirect) {
          // 动态路径
          if (/:/.test(pathsNextText)) {
            dynamicRoutes.push({
              redirect,
              pathMatch: match(pathsNextText),
              layout: routeLayout,
            });
          } else {
            staticRoutes[pathsNextText] = {
              redirect,
              layout: routeLayout,
            };
          }

          return;
        }

        // 存在子级路由
        if (children) {
          let menuRoutesNext;

          // 当前配置是菜单项
          if (route.menuTitle) {
            menuRoutesNext = menuRoutes[menuRoutes.length - 1].children = [];
          } else {
            menuRoutesNext = menuRoutes;
          }

          walkRoutes(children, pathsNext, routeLayout, menuRoutesNext);
        }

        // 非页面级别的路由配置项
        if (!route.page && !route.render && !route.lazy) {
          const routeItem = {
            path: pathsNextText,
            navTitle: route.navTitle,
            layout: routeLayout,
          };

          if (staticRoutes[pathsNextText]) {
            Object.assign(staticRoutes[pathsNextText], routeItem);
          } else {
            staticRoutes[pathsNextText] = routeItem;
          }

          return;
        }

        const tempRouteConfig: RouterRouteConfig = {
          path: pathsNextText,
          layout: routeLayout,
          keepAliveMatchs: [],
          title: route.title,
          loginIgnore: route.loginIgnore || false,
          authIgnore: route.authIgnore || !route.auths || false,
          auths: route.auths || [],
          icon: route.icon,
          navTitle: route.navTitle,
          isLoaded: true,
          isPage: true,
        };

        // 路由缓存
        const { keepAlive } = route;
        if (keepAlive) {
          tempRouteConfig.keepAliveMatchs = (
            Array.isArray(keepAlive) ? keepAlive : [keepAlive]
          ).map((item) => match(item));
        }

        let RouteView;
        if (route.render) {
          RouteView = memo(() => route.render());
        } else if (route.page) {
          RouteView = memo(() => <route.page />);
        } else if (route.lazy) {
          RouteView = memo(() => {
            const [Component, ComponentSet] = useState(() => () => null);
            useEffect(() => {
              route.lazy().then((result) => {
                tempRouteConfig.isLoaded = true;
                tempRouteConfig.RouteView = memo(() => {
                  useEffect(() => {
                    // console.info('finish', this.state.cmd);

                    Promise.resolve().then(() => {
                      if (
                        this.state.loading &&
                        this.matchedRoute === tempRouteConfig
                      ) {
                        this.update({ cmd: 'finish', loading: false });
                      }
                    });
                  }, [this.version]);

                  return <result.default />;
                });
                this.update({ cmd: `lazy.ready${tempRouteConfig.path}` });
              });
            }, []);
            return <Component />;
          });
          tempRouteConfig.isLoaded = false;
        }

        tempRouteConfig.RouteView = RouteView;

        // 判断是动态还是静态路径的路由
        if (/:/.test(pathsNextText)) {
          tempRouteConfig.pathMatch = match(pathsNextText);
          dynamicRoutes.push(tempRouteConfig);
        } else {
          staticRoutes[pathsNextText] = tempRouteConfig;
        }
      });
      // ..
    };

    walkRoutes(routes, [], {}, menuRoutes);

    // console.info(this);
  }

  private initNavList(pathname) {
    const navList = [];

    pathname.split('/').reduce((paths, path) => {
      paths.push(path);
      const pathname = paths.join('/');

      // 第一层不做处理
      if (pathname) {
        const matchedRouteConfig = this.matchRouteConfig(pathname);
        if (matchedRouteConfig && matchedRouteConfig.navTitle) {
          const { navTitle, isPage } = matchedRouteConfig;
          navList.push({
            title: navTitle,
            path: pathname,
            isPage,
          });
        }
      }
      return paths;
    }, []);
    // console.info({ pathname, navList, staticRoutes: this.staticRoutes });
    this.state.navList = navList;
  }

  Render = () => {
    const [version, update] = useState({});
    const [routerImage] = useState(() => ({
      RenderLayout: this.RenderLayout,
    }));
    const { state, Spin } = this;

    this.forceUpdate = update;

    // 路由初始化状态
    this.onReady();

    // 监听路由变化
    useMemo(() => {
      if (!state.isReady) {
        return;
      }
      this.updateRoute();
    }, [window.location.href, state.isReady]);

    useEffect(() => {
      if (!state.isReady) {
        return;
      }

      // console.info(this.matchedRoute, '###');

      this.update({
        cmd: `setLoading:true:${window.location.href}`,

        // 异步组件需要loading状态
        loading: !this.matchedRoute?.isLoaded,
      });
    }, [window.location.href, state.isReady]);

    // 未就绪，则直接返回加载中
    if (!state.isReady) {
      return (
        <Spin size="large">
          <div style={{ height: '100vh' }} />
        </Spin>
      );
    }

    return <RouterRender version={version} router={routerImage} />;
  };

  private CurrentView = () =>
    this.matchRedirect() ||
    this.onEnter(this) ||
    this.matchNotFound() ||
    this.matchRoute();

  private KeepAliveView = () => (
    <>
      {this.keepAliveRoutes.map((route) => {
        if (route === this.matchedRoute) {
          return (
            <div key={route.path}>
              <route.RouteView version={this.href} />
            </div>
          );
        }

        return (
          <div key={route.path} style={{ display: 'none' }}>
            <route.RouteView />
          </div>
        );
      })}
    </>
  );

  private RenderLayout = () => {
    const { Layout, CurrentView, KeepAliveView, Spin } = this;

    const content = (
      <>
        <Spin spinning={this.state.loading} style={{ height: '100vh' }}>
          <CurrentView />
          <KeepAliveView />
        </Spin>
      </>
    );

    if (Layout) {
      const layout =
        this.matchedRoute?.layout || this.matchedRoutePrev?.layout || {};

      return (
        <Layout
          {...{
            layout: {
              ...layout,
              styles: {
                ...layout.styles,
              },
            },
            menuList: this.state.menuList,
            navList: this.state.navList,
            loading: this.state.loading,
            content,
            pathname: this.route.path,
          }}
        />
      );
    }

    return content;

    // return (
    //   <Spin spinning={this.state.loading} style={{ height: '100vh' }}>
    //     {content}
    //   </Spin>
    // );
  };

  // 更新就绪状态
  private setReady(state) {
    if (this.state.isReady) {
      return;
    }
    this.update({
      cmd: 'setReady',
      ...state,
      isReady: true,
      menuList: this.createMenuList(state.auths),
    });
  }

  // 创建菜单数据
  private createMenuList(auths) {
    const menuList = [];

    walkNodes(this.menuRoutes, menuList);

    return menuList;

    function walkNodes(routes, menuList) {
      routes.forEach((route) => {
        const nextRoute = {
          ...route,
        };

        if (
          route.authIgnore ||
          route.auths.some((auth) => auths.includes(auth))
        ) {
          menuList.push(nextRoute);

          if (route.children) {
            walkNodes(route.children, (nextRoute.children = []));
          }
        }

        // console.info({ route: route.auths, auths });
      });
    }
  }

  // 触发更新
  private update(state) {
    this.state = {
      ...this.state,
      ...state,
    };

    // console.info(
    //   '@@@@@@@@@@@@@@@@@update',
    //   this.state.cmd,
    //   // JSON.parse(JSON.stringify(this.state)),
    //   String(Date.now()).substr(8)
    // );
    this.forceUpdate((this.version = {}));
  }

  // 更新路由信息
  private updateRoute() {
    const { location } = window;
    const { pathname, search } = location;
    this.href = location.href;
    this.matchedRoutePrev = this.matchedRoute;
    const matchedRoute = (this.matchedRoute = this.matchRouteConfig(
      pathname.replace(this.basePath, '')
    ));

    // 解析查询参数
    const query: KeyValue = {};
    if (search) {
      search
        .substr(1)
        .split(/&/)
        .forEach((item: string) => {
          const [key, value] = item.split('=');
          if (key === '$data') {
            try {
              query[key] = JSON.parse(decodeURIComponent(value));
            } catch (err) {
              // ..
            }
          } else {
            query[key] = decodeURIComponent(value);
          }
        });
    }

    // 生成路由信息对象
    if (matchedRoute && !matchedRoute.redirect) {
      this.route = {
        path: matchedRoute.path,
        layout: matchedRoute.layout,
        title: matchedRoute.title,
        params: matchedRoute.pathMatch
          ? matchedRoute.pathMatch(pathname)?.params
          : {},
        query,
      };
      this.initNavList(pathname);
    } else {
      this.route = {
        path: pathname,
        layout: {},
        params: {},
        query,
      };
    }
  }

  // 根据路由路径匹配路由信息
  private matchRouteConfig(pathname) {
    // 尝试从静态路由表中获取;
    let matchedRoute = this.staticRoutes[pathname];

    // 尝试从动态路由表中获取
    if (!matchedRoute) {
      matchedRoute = this.dynamicRoutes.find((route) =>
        route.pathMatch(pathname)
      );
    }
    return matchedRoute;
  }

  // 匹配路由跳转
  private matchRedirect() {
    const { matchedRoute } = this;
    if (
      matchedRoute &&
      /^(string|object|function)$/.test(typeof matchedRoute.redirect)
    ) {
      const { redirect } = matchedRoute;
      let queryString;
      let redirectTo;

      const typeofRedirect = typeof redirect;
      const routeQuery = this.route.query;

      if (typeofRedirect === 'object') {
        const { path, query } = redirect as { query: boolean; path: string };
        if (query === true) {
          queryString = queryStringify(routeQuery);
        } else if (typeof query === 'function') {
          queryString = queryStringify(
            (query as (q: KeyValue) => string)(routeQuery)
          );
        } else {
          queryString = queryStringify(query);
        }
        redirectTo = path + (queryString ? `?${queryString}` : '');
      } else if (typeofRedirect === 'function') {
        redirectTo = (redirect as (query: KeyValue) => string)(routeQuery);
      } else {
        redirectTo = redirect;
      }

      return <Redirect to={redirectTo} />;
    }
  }

  // 匹配未定义的路由
  private matchNotFound() {
    if (this.notFound()) {
      return <div>PAGE404</div>;
    }
  }

  // 生成匹配的路由
  private matchRoute() {
    const { matchedRoute } = this;
    if (!matchedRoute || matchedRoute.redirect) {
      return null;
    }

    const keepAliveRoutes = this.keepAliveRoutes.filter((item) => {
      if (matchedRoute === item) {
        return false;
      }

      // 符合keepAlive的组件继续保持
      return item.keepAliveMatchs.some((matchPath) =>
        matchPath(matchedRoute.path)
      );
    });

    // 不是从拦截器中返回的节点，则进行保存
    if (matchedRoute.keepAliveMatchs) {
      keepAliveRoutes.push(matchedRoute);
    }

    this.keepAliveRoutes = [...keepAliveRoutes];

    // console.info('matchRoute', this.keepAliveRoutes);
    return null;
  }

  notFound() {
    return !this.matchedRoute;
  }

  title() {
    const { matchedRoute } = this;
    if (!matchedRoute) {
      return;
    }

    const { title } = matchedRoute;
    return (
      this.route.query.$title ||
      (typeof title === 'function' ? title(this.route) : title)
    );
  }

  needLogin() {
    return this.matchedRoute && !this.matchedRoute?.loginIgnore;
  }

  notLogin() {
    return !this.state.isLogin;
  }

  notAuth() {
    return (
      this.needLogin() &&
      !this.matchedRoute.authIgnore &&
      !this.matchedRoute.auths?.some((auth) => this.state.auths.includes(auth))
    );
  }
}

const RouterRender = memo(({ router }: { version: any; router: any }) => (
  <router.RenderLayout />
));

export default Router;
