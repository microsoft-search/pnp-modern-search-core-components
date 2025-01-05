const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

require('dotenv').config();

module.exports = {
    devtool: "eval-source-map",    
    entry: path.resolve(__dirname, "../../src/server.ts"),
    target: "node",
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
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
            }
        ]
    },
    resolve: {
        extensions: [".ts",".js"]
    },
    output: {
        filename: "server.js",
        path: path.resolve(__dirname, "../../dist"),
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, "../../src/views/index.html"),
            inject: false
        }),
        new CopyWebpackPlugin(
            {
              patterns: [
                { from: path.resolve(__dirname, "../../web.config") },
                { from: path.resolve(__dirname, "../../src/auth"), to: "auth" },
                { from: path.resolve(__dirname, "../../../../packages/components/assets/logo.svg"), to: "public/assets" }
              ]
            }
        ),
    ],
    ignoreWarnings: [
        {
            message: /Critical dependency: the request of a dependency is an expression/
        }
    ]
};
