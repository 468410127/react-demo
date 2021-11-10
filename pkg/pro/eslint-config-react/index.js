module.exports = {
  root: true,
  extends: ['../eslint-config-base'],
  plugins: ['react'],
  rules: {
    // https://www.npmjs.com/package/eslint-plugin-react
    // 关闭props类型检测
    'react/prop-types': 0,

    // 允许匿名组件
    'react/display-name': 0,

    // 检测缺少key的jsx
    'react/jsx-key': [1, { checkFragmentShorthand: true }],

    // 强制要求转译html特殊字符
    'react/no-unescaped-entities': ['error', { forbid: ['>', '<'] }],
  },
  settings: {
    // 'import/extensions': ['.js', '.jsx'],
    'import/resolver': {
      // 项目路径别名配置
      // alias: {
      //   map: [['@', './src']],
      //   extensions: ['.js', '.jsx', '.json '],
      // },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: {
      version: 'detect',
    },
  },
};
