该项目是以`react`+`webpack`+`ts`搭建的，没有使用命令行生成脚手架，灵活性更高,功能点完整，可直接拿来当模版使用

以下是项目的主要设计点

1. 构建环境和配置
|- `config` （存放全局环境变量，网关反向代理等信息）
|- `webpack`（webpack打包工具配置）

2. cdn静态资源文件
|- `public/cdn/*`（用于存放已经构建好的静态资源，减少构建内容，提升构建性能）

3. 通用npm包本地化
|- `pkg`（npm包本地化，主要是一些自己开发的npm工具包，可能包含通用组件，工具类，设计模式实践方案等）

4. 开发目录
|- `src`（平台开发代码）

5. 接口模块
|- `src/api`（管理所有网关接口服务的模块，处理通用数据拦截，错误处理等逻辑）

6. 布局模块
|- `src/layout`（管理平台整体布局，比如公用头，菜单，导航等）

7. 路由模块
|- `src/router`（控制路由拦截，路由权限，404页面等基础逻辑）

8. 应用接口中心
|- `src/export`（统一应用注册中心，是应用间耦合的唯一方式，其他应用可以从这里使用其他应用的模块）

9. 业务应用中心
|- `src/app`（存放所有的业务应用，所有的业务都是以应用的方式承载）

整个系统的目录设计

|- app（业务应用）

|- app/export（应用对外导出的接口）-- 负责跨应用之间的功能交互

|- app/state（应用的全局状态）-- 负责应用全局状态的初始化，更新等逻辑，页面级的状态不在此处管理

|- app/api（应用的接口配置）-- 负责网关服务的接口配置，数据适配转化，接口以及数据的签名等

|- app/router（应用的路由配置）-- 负责路由的配置，包含导航菜单，面包屑，页面标题，路由权限等

|- app/test（应用测试相关的文件）

|- app/view（应用的路由入口文件）-- 所有的业务路由入口文件都会在这里出现
