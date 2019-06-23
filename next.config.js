const withTypescript = require('@zeit/next-typescript');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = withTypescript({
  webpack(config, options) {
    // Do not run type checking twice:
    if (options.isServer) config.plugins.push(new ForkTsCheckerWebpackPlugin())

    if (!options.isServer && !options.dev) {
      config.optimization.splitChunks.cacheGroups.commons.minChunks = 2
    }

    return config
  },
  // target: 'serverless'
});