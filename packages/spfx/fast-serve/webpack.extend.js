/*
* User webpack settings file. You can add your own settings here.
* Changes from this file will be merged into the base webpack configuration file.
* This file will not be overwritten by the subsequent spfx-fast-serve calls.
*/

// you can add your project related webpack configuration here, it will be merged using webpack-merge module
// i.e. plugins: [new webpack.Plugin()]
const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: (_) => {            
          return /node_modules/.test(_) && !/(@microsoft|@monaco-editor|@pnp\/modern-search-core)/.test(_)
        },
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /strings\..+\.d\.ts$/,
        use: 
          {
            loader: 'null-loader',
          }
        
      },
      {
        test: /\.js$/,
        exclude: (_) => {            
          return /node_modules/.test(_) && !/(@pnp)/.test(_) && /strings\..+\.js\.map$/.test(_);
        },
        enforce: 'pre',
        use: ['source-map-loader'],
      }
    ]

  },
}

// for even more fine-grained control, you can apply custom webpack settings using below function
const transformConfig = function (initialWebpackConfig) {
  // transform the initial webpack config here, i.e.
  // initialWebpackConfig.plugins.push(new webpack.Plugin()); etc.

  return initialWebpackConfig;
}

module.exports = {
  webpackConfig,
  transformConfig
}
