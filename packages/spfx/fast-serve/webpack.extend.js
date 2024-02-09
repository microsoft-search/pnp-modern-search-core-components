/*
* User webpack settings file. You can add your own settings here.
* Changes from this file will be merged into the base webpack configuration file.
* This file will not be overwritten by the subsequent spfx-fast-serve calls.
*/

const path = require('path');

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
        test: /\.js$/,
        // only run on lit packages in the root node_module folder
        include: /node_modules\/(\@lit)|(lit)/,
        exclude: [
          {
            // Exclude this rule from everything.
            test: __dirname,
            // Add back the ES2021 Lit dependencies. Add anything else here that uses modern
            // JavaScript that Webpack 4 doesn't understand.
            exclude: ['@lit', 'lit-element', 'lit-html'].map((p) =>
              path.resolve(__dirname, 'node_modules/' + p)
            ),
          },
        ],
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              "@babel/plugin-transform-optional-chaining",
              "@babel/plugin-transform-nullish-coalescing-operator",
              "@babel/plugin-transform-logical-assignment-operators"
            ]
          }
        }
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
