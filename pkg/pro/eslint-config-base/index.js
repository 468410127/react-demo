module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
    },
  },
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:promise/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['promise', 'prettier', 'simple-import-sort'],
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  rules: {
    // 运行使用console.warn和console.error
    'no-console': [2, { allow: ['warn', 'error'] }],

    // 允许累计运算符，++，--
    'no-plusplus': 0,

    // 允许无限循环条件
    'no-constant-condition': ['error', { checkLoops: false }],

    // 允许函数定义在后面
    'no-use-before-define': 0,

    // 允许函数返回不一致的值
    'consistent-return': 0,

    // 允许表达式判断条件
    'no-cond-assign': [2, 'except-parens'],

    // 重名变量使用警告
    'no-shadow': 1,

    // 允许赋值返回值，在惰性加载重写函数的情况下特别有用
    'no-return-assign': [2, 'except-parens'],

    // 允许for in操作
    'guard-for-in': 0,

    // 不允许使用with语法
    'no-restricted-syntax': [2, 'WithStatement'],

    // 允许文件中有多个类声明
    'max-classes-per-file': 0,

    // 允许多重赋值
    'no-multi-assign': 0,

    // 允许下划线
    'no-underscore-dangle': 0,

    // 允许修改对象型参数的属性
    'no-param-reassign': [1, { props: false }],

    // 修改循环中的异步调用为警告
    'no-await-in-loop': 1,

    // 修改未使用变量为警告
    'no-unused-vars': [1, { args: 'none', ignoreRestSiblings: true }],

    // 允许没有default
    'default-case': 0,

    // 允许方法中不使用this
    'class-methods-use-this': 0,

    // 允许表达式调用
    'no-unused-expressions': [
      2,
      {
        // 允许使用逻辑短路运算符
        allowShortCircuit: true,

        // 允许使用三元运算符
        allowTernary: true,

        // 允许使用标记的模板文字
        allowTaggedTemplates: true,
      },
    ],

    // 允许直接使用new而不需要赋值给变量
    'no-new': 0,

    // 允许continue语法
    'no-continue': 0,

    // 允许使用逗号运算符
    'no-sequences': 0,

    // 允许使用hasOwnProperty,isPrototypeOf
    'no-prototype-builtins': 0,

    // 允许使用下划线定义变量名称
    camelcase: 'off',

    // 忽略导入扩展名
    'import/extensions': [
      'error',
      'never',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        css: 'ignorePackages',
        json: 'ignorePackages',
      },
    ],

    // 'import/default': 2,

    // 允许模块不导出default
    'import/prefer-default-export': 0,

    // https://www.npmjs.com/package/eslint-plugin-promise#rules

    // 允许promise没有返回值
    'promise/always-return': 0,
    // 'promise/no-return-wrap': 'error',
    // 'promise/param-names': 'error',

    // 允许错误没有返回值
    'promise/catch-or-return': 0,

    // 'promise/no-native': 'off',

    // 允许promise嵌套
    'promise/no-nesting': 'off',
    // 'promise/no-promise-in-callback': 'warn',
    // 'promise/no-callback-in-promise': 'warn',

    //
    'promise/avoid-new': 0,
    // 'promise/no-new-statics': 'error',
    // 'promise/no-return-in-finally': 'warn',
    // 'promise/valid-params': 'warn',

    'prettier/prettier': 'error',

    // 关闭已在eslint中定义过的规则
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',

    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
  },
  overrides: [
    {
      files: ['*.jsx', '*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  settings: {
    // 'import/extensions': ['.js', '.jsx'],
    'import/resolver': {
      // alias: {
      //   map: [['@', './src']],
      //   extensions: ['.js', '.jsx', '.json '],
      // },
      node: {
        extensions: ['.js', '.ts'],
      },
    },

    // 忽略导入类型错误提示
    'import/ignore': [/\.(scss|less|css|json)$/],
  },
};
