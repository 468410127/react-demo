// 定义环境变量
module.exports = {
  // 项目的基础路径，会影响路由基础路径，静态资源起始路径
  BasePath: '/',

  // 网关原始域
  GatewayOrigin:
    {
      test: 'http://127.0.0.1:18000',
      site: 'http://127.0.0.1:18000',
      release: 'http://127.0.0.1:18000',
    }[process.env.Gateway] || 'https://127.0.0.1',

  // 网站默认标题
  DefaultTitle: '我的应用',

  // 发布目录
  DistDir: 'dist',
};
