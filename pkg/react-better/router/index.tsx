import React, { memo, useEffect } from 'react';
import {
  BrowserRouter,
  Link,
  Redirect,
  Route,
  useHistory,
} from 'react-router-dom';

import { queryStringify } from './helper';
import Router from './Router';
import { MyLinkProps, RouterOption } from './typings';

let activeRouter = null;

// 创建路由对象
function createRouter(routerOption: RouterOption) {
  const router = (activeRouter = new Router(routerOption));
  const RouterRender = router.Render;
  return () => (
    <BrowserRouter basename={routerOption.basePath || '/'}>
      <Route render={() => <RouterRender />}></Route>
    </BrowserRouter>
  );
}

// 封装过的Link，扩展了官方的Link，实现了json数据的保存，实现了相对路径的修复
function MyLink(props: MyLinkProps) {
  const { to, ...restProps } = props;
  let myLinkTo = to;
  if (typeof to === 'object') {
    const { query } = to;
    if (query && typeof query === 'object') {
      if (query.$data !== undefined) {
        query.$data = encodeURIComponent(JSON.stringify(query.$data));
      }
      to.search = `?${queryStringify(query)}`;
    }
    to.pathname = fixPath(to.pathname);
  } else if (typeof to === 'string') {
    myLinkTo = fixPath(to);
  }

  return <Link {...restProps} to={myLinkTo} />;

  // 需要把后缀加到相对路径的地址上
  function fixPath(path) {
    const route = useRoute();

    if (!route.path) {
      return path;
    }

    const suffix = route.path.match(/([\w-]+)$/);

    if (!suffix) {
      return;
    }

    const suffixText = suffix[1];

    // 绝对路径，不做修复
    if (/^\//.test(path)) {
      return path;
    }

    // 当前路径
    if (/^(\.|\.\/|)$/.test(path)) {
      return `./${suffixText}`;
    }

    // 以“./”开始的相对路径
    if (/\.\//.test(path)) {
      return `./${suffixText}/${path.substr(2)}`;
    }

    // 普通路径
    return `${suffixText}/${path}`;
  }
}

function useRoute() {
  return activeRouter.route;
}

function useRedirect() {
  const history = useHistory();
  return function redirect(path, query) {
    if (typeof path === 'object') {
      history.push(path);
    } else if (typeof path === 'string') {
      history.push({
        pathname: path,
        search: queryToSearch(query),
      });
    }
  };
}

export default createRouter;

export { MyLink as Link, Redirect, useHistory, useRedirect, useRoute };
