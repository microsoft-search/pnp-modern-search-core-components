const path = require("path");
const HtmlWebpackHarddiskPlugin = require("html-webpack-harddisk-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/bundle/index.ts",
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [                           
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json",
            }
          }          
        ],
        exclude: [
          /node_modules/
        ]
      },
      {
        test: /\.ts?$/,
        use: [                           
          {
            loader: "postcss-loader"
          }          
        ],
        exclude: [
          /node_modules/,
          /tailwind-styles-css\.ts/
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      }
    ]
  },
  resolve: {
    extensions: [".ts",".js"]
  },
  output: {
    chunkFilename: "[name].bundle.js",
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "auto", // Ensure the bundle chunks will be resovled correctly if served from a CDN
    clean: true
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
      watch: true,
    },
    compress: true,
    port: 8080,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  },
  plugins: [
    new HtmlWebpackPlugin(
        {
          title: "PnP - Results test page",
          filename: "index.html",
          template: "dev/index.html",
          alwaysWriteToDisk: true,
          minify: false
        }
    ),
    new HtmlWebpackHarddiskPlugin({
      outputPath: path.resolve(__dirname, "dist")
    }),
    new CopyWebpackPlugin(
      {
        patterns: [
          { from: "assets", to: "assets" }
        ]
      }
    ),
    new BundleAnalyzerPlugin({
        openAnalyzer: false,
        analyzerMode: "static",
        generateStatsFile: false,
        logLevel: "error"
    })
  ]
};
