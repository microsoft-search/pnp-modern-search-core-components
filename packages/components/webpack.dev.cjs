const { merge } = require("webpack-merge");
const common = require("./webpack.common.cjs");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(common, {
    mode: "development",
    devtool: "eval-source-map",    
    plugins: [
        new CopyWebpackPlugin(
          {
            patterns: [
              { from: "dev/index.css" }
            ]
          }
        )
      ]
});