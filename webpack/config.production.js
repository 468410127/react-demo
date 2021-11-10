const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const Config = require('./Config');

const smp = new SpeedMeasurePlugin();

const config = new Config({
  mode: 'development',
  devtool: 'none',
  // performance: {
  //   maxEntrypointSize: 1024 * 1024,
  //   maxAssetSize: 1024 * 1024,
  // },
});

module.exports = smp.wrap(config.value());
