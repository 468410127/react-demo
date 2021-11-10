const env = require('../../config/env');

class Base {
  constructor(option) {
    const { mode, CDN, ...rest } = option;

    this.isDevelopment = mode === 'development';
    this.config = {
      mode,
      ...rest,
    };

    this.CDN = CDN;
    this.rules = [];
    this.plugins = [];
    this.env = {
      ...env,
    };

    if (this.isDevelopment) {
      this.env.BasePath = '/';
    }

    this.initEntry();
    this.initOutput();
    this.initResolve();
    this.initDevServer();
    this.initOptimization();
    this.initRules();
    this.initPlugins();
  }

  addRule(option) {
    if (Array.isArray(option)) {
      option.forEach((rule) => this.rules.push(rule));
    } else {
      this.rules.push(option);
    }
  }

  getRules() {
    return this.rules.map((rule) =>
      typeof rule === 'function' ? rule(this) : rule
    );
  }

  addPlugin(Plugin, getOption) {
    this.plugins.push({
      Plugin,
      getOption,
    });
  }

  getPlugins() {
    return this.plugins.map(({ Plugin, getOption }) => {
      const option =
        typeof getOption === 'function' ? getOption(this) : getOption;

      if (Array.isArray(option)) {
        return new Plugin(...option);
      }

      return new Plugin(option);
    });
  }

  value() {
    return {
      ...this.config,
      entry: this.entry,
      output: this.output,
      resolve: this.resolve,
      devServer: this.devServer,
      optimization: this.optimization,
      module: {
        rules: this.getRules(),
      },
      plugins: this.getPlugins(),
    };
  }
}

module.exports = Base;
