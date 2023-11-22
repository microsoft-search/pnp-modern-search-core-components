const { merge } = require("webpack-merge");
const common = require("./webpack.common.cjs");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  performance: {
    hints: false
  },
  plugins: [
    new CompressionPlugin({
      algorithm: "gzip",
      filename: "[path][base]",
      minRatio: Infinity,
      exclude: /.map$/,
      deleteOriginalAssets: "keep-source-map",
      test: /\.js(\?.*)?$/i,
    })
  ]
});