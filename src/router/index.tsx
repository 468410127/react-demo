// import { Spin } from 'antd';
import createRouter, { Redirect } from '@react-better/router';
import React, { useEffect } from 'react';

import { BasePath, DefaultTitle } from '@/config';
import Layout from '@/layout';

import Spin from './Loading';
import routes from './routes';

export default createRouter({
  Spin,
  Layout,
  routes,
  basePath: BasePath,
  onReady(resolve) {
    // 初始化登录状态
    useEffect(() => {
      setTimeout(() => {
        resolve({
          auths: [],
        });
      }, 1000);
    }, []);
  },
  onEnter(router) {
    // document.title = router.title() || DefaultTitle;
    // console.info('@@@@@@@@@@@@@@');
    // if (router.notFound()) {
    //   return <Redirect to="/page404" />;
    // }
    // if (!router.notLogin()) {
    //   if (router.route.path === '/login') {
    //     return <Redirect to="/" />;
    //   }
    // } else if (router.needLogin()) {
    //   return <Redirect to="/login" />;
    // }
    // if (router.notAuth()) {
    //   return <Redirect to="/pageauth" />;
    // }
    // if (router.notFound()) {
    //   return <Redirect to="/page404" />;
    // }
  },
});
