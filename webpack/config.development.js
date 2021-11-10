const Config = require('./Config');

const config = new Config({
  mode: 'development',
  devtool: 'eval-source-map',
  // devtool: 'cheap-module-eval-source-map',
  // devtool: 'inline-source-map',
  externals: {
    lodash: '_',
    react: 'React',
    'react-dom': 'ReactDOM',
    antd: 'antd',
    moment: 'moment',
    '@ant-design/icons': 'icons',
    'monaco-editor': 'monaco',
  },
  CDN: [
    'lodash@4.17.20/lodash.js',
    'react@17.0.1/react.development.js',
    'react-dom@17.0.1/react-dom.development.js',
    'momentjs@2.29.1/moment.js',
    'momentjs@2.29.1/zh-cn.js',
    'antd@4.15.0/antd.min.js',
    'antd@4.15.0/antd.min.css',
    // 'fonts/iconfont.css',
    'ant-design-icons@4.2.2/index.umd.js',
    'monaco-editor@0.21.2/min/vs/loader.js',
    'monaco-editor@0.21.2/config.js',
    'monaco-editor@0.21.2/min/vs/editor/editor.main.nls.js',
    'monaco-editor@0.21.2/min/vs/editor/editor.main.js',
  ],
});

module.exports = config.value();
