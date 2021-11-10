const { GatewayOrigin } = require('./env');

// 接口反向代理配置项
module.exports = {
  // port: 80,
  '/openapi/': {
    target: 'http://localhost:8090/', // 开发环境
    changeOrigin: true,
    pathRewrite: {
      '/openapi/': '/openapi/',
    },
  },
  '/mockapi/': {
    target: 'http://localhost:8090/', // 开发环境
    changeOrigin: true,
    pathRewrite: {
      '/mockapi/': '/mockapi/',
    },
  },

  '/ws/': {
    target: 'ws://127.0.0.1:18000/', // 开发环境
    changeOrigin: true,
    // pathRewrite: {
    //   '/ws/': '/ws/',
    // },
    // pathRewrite: {
    //   '/ws/': '/ws/',
    // },
    // ws: true,
  },
  '/xapi/*': {
    target: GatewayOrigin,
    changeOrigin: true,
    // pathRewrite: { '^/oc': '' },
  },
};
