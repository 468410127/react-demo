const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const WebpackBar = require('webpackbar');
const webpack = require('webpack');
const Base = require('./Base');
const proxy = require('../../config/proxy');
const items = require('../../api-server/json/all');
const categories = require('../../api-server/json/categories');

const cwd = process.cwd();
const resolve = (dir) => path.resolve(cwd, dir);

class Config extends Base {
  initEntry() {
    this.entry = {
      main: './src/index.ts',
    };
  }

  initOutput() {
    this.output = {
      publicPath: this.env.BasePath,
      path: resolve(this.env.DistDir),
      filename: `js/[name].[${this.isDevelopment ? 'hash' : 'contenthash'}].js`,
    };
  }

  initResolve() {
    this.resolve = {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'], // 默认扩展
      alias: {
        '@': resolve('src'),
        '@pkg': resolve('pkg'),
        '@pro': resolve('pkg/pro'),
        '@react-better': resolve('pkg/react-better'),
        'antd-oo': resolve('pkg/antd-oo'),
      },
    };
  }

  initDevServer() {
    if (!this.isDevelopment) {
      return;
    }

    this.devServer = {
      contentBase: ['./public', './dist'],
      progress: true,
      hot: true,
      inline: true,
      publicPath: this.env.BasePath,
      // hotOnly: true,
      open: true,
      clientLogLevel: 'error', // none, warn, error, info
      before(app) {
        app.get('/favicon.ico', (req, res) => {
          res.end();
        });

        app.get('/api/items', (req, res) => {
          res.json({ code: 0, data: items.data });
        });

        app.get('/api/item/:id', (req, res) => {
          const idx = req.params.id;
          res.json({ code: 0, data: items.data[idx] });
        });

        app.get('/api/categories', (req, res) => {
          res.json({ code: 0, ...categories });
        });
      },
      // after(app, server, compiler) {
      //   console.info('after');
      // },
      historyApiFallback: true,
      proxy,
    };
  }

  initOptimization() {
    this.optimization = {
      // 找到chunk中共享的模块,取出来生成单独的chunk
      splitChunks: {
        chunks: 'all', // async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
        cacheGroups: {
          vendors: {
            // 抽离第三方插件
            test: /[\\/]node_modules[\\/]/, // 指定是node_modules下的第三方包
            name: 'vendors',
            priority: -10, // 抽取优先级
          },
          utilCommon: {
            // 抽离自定义工具库
            name: 'common',
            minSize: 0, // 将引用模块分离成新代码文件的最小体积
            minChunks: 2, // 表示将引用模块如不同文件引用了多少次，才能分离生成新chunk
            priority: -20,
          },
        },
      },
      // 为 webpack 运行时代码创建单独的chunk
      runtimeChunk: {
        name: 'manifest',
      },
    };
  }

  initRules() {
    this.initJSLoader();
    this.initCSSLoader();
    this.initResLoader();
  }

  initJSLoader() {
    this.addRule({
      test: /\.(jsx?|tsx?)$/, // 一个匹配loaders所处理的文件的拓展名的正则表达式，这里用来匹配js和jsx文件（必须）
      include: [resolve('src'), resolve('pkg')],
      use: [
        {
          loader: 'babel-loader', // loader的名称（必须）
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry', // or "usage"
                  corejs: 3,
                },
              ],
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
            plugins: [
              ...(this.isDevelopment
                ? []
                : ['lodash', ['import', { libraryName: 'antd', style: true }]]),
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              // ['@babel/plugin-proposal-class-properties', { loose: false }],
            ],
          },
        },
      ],
    });
  }

  initCSSLoader() {
    this.addRule([
      // 非业务样式关闭css-module
      {
        test: /\.css$/,
        include: [/node_modules/],
        use: [
          {
            loader: 'style-loader', // 创建 <style></style>
          },
          {
            loader: 'css-loader', // 转换css
            options: {
              modules: false,
            },
          },
        ],
      },

      // 业务样式使用css-module
      {
        test: /\.css$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'style-loader', // 创建 <style></style>
          },
          {
            loader: 'css-loader', // 转换css
            options: {
              modules: true,
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 15, // 10px = 1rem
              remPrecision: 8, // rem的小数点后位数
            },
          },
        ],
      },

      // less设置
      {
        test: /\.less$/,
        include: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: false,
            },
          },
          {
            loader: 'less-loader', // 编译 Less -> CSS
            options: {
              lessOptions: {
                // modifyVars: { '@primary-color': '#1DA57A' },
                javascriptEnabled: true,
              },
            },
          },
        ],
      },

      // 业务代码，less开启modules
      {
        test: /\.less$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 15, // 75px = 1rem
              remPrecision: 8, // rem的小数点后位数
            },
          },
          {
            loader: 'less-loader', // 编译 Less -> CSS
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ]);
  }

  initResLoader() {
    this.addRule([
      {
        test: /\.(png|jpe?g|gif|woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000, // url-loader 包含file-loader，这里不用file-loader, 小于10000B的图片base64的方式引入，大于10000B的图片以路径的方式导入
          name: 'static/img/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.svg(\?.*)?$/,
        use: ['@svgr/webpack', 'url-loader'],
      },
    ]);
  }

  initPlugins() {
    this.initHtmlWebpackPlugin();
    this.initWebpackBar();
    this.initDefinePlugin();
    this.initCleanWebpackPlugin();
    this.initLodashModuleReplacementPlugin();
    this.initOtherPlugins();
  }

  // 生成html入口文件
  initHtmlWebpackPlugin() {
    this.addPlugin(HtmlWebpackPlugin, () => {
      return {
        publicPath: this.env.BasePath || '/',
        filename: resolve(`${this.env.DistDir}/index.html`), // html模板的生成路径
        template: './src/index.ejs', // html模板
        inject: true, // true：默认值，script标签位于html文件的 body 底部
        // hash: true, // 在打包的资源插入html会加上hash
        //  html 文件进行压缩
        templateParameters: {
          DefaultTitle: this.env.DefaultTitle,
          CDN: this.CDN || [],
        },
        // ...(isDevelopment
        //   ? {}
        //   : {
        //       minify: {
        //         removeComments: true, // 去注释
        //         collapseWhitespace: true, // 压缩空格
        //         removeAttributeQuotes: true, // 去除属性 标签的 引号  例如 <p id="test" /> 输出 <p id=test/>
        //       },
        //     }),
      };
    });
  }

  initWebpackBar() {
    this.addPlugin(WebpackBar);
  }

  initDefinePlugin() {
    this.addPlugin(webpack.DefinePlugin, {
      'process.env': JSON.stringify({
        ...this.env,
        NODE_ENV: process.env.NODE_ENV,
        Built: String(new Date()),
      }),
    });
  }

  initCleanWebpackPlugin() {
    if (this.isDevelopment) {
      return;
    }
    this.addPlugin(CleanWebpackPlugin);
  }

  initLodashModuleReplacementPlugin() {
    if (this.isDevelopment) {
      return;
    }
    this.addPlugin(LodashModuleReplacementPlugin);
  }

  initOtherPlugins() {
    if (this.isDevelopment) {
      return;
    }
    this.addPlugin(webpack.ContextReplacementPlugin, [
      /moment[/\\]locale$/,
      /zh-cn/,
    ]);
  }
}

module.exports = Config;
