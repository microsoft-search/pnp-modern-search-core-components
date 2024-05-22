const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

require('dotenv').config();

module.exports = {
    entry: path.resolve(__dirname, "../../src/app.ts"),
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
                    /node_modules/,
                    /strings\..+(\.d\.ts)/,
                ]
            },
            {
                test: /strings\..+(\.d\.ts)/,
                use: 
                {
                    loader: 'null-loader',
                }                
            },
            {
                test: /strings\..+\.map/,
                use: 
                {
                    loader: 'json-loader',
                }
            }
        ]
    },
    resolve: {
        extensions: [".ts",".js"]
    },
    plugins: [  
        new CopyWebpackPlugin(
            {
              patterns: [
                { from: path.resolve(__dirname, "../../../../packages/components/assets"), to: "assets" }, // Copy assets from the original component package
                { from: path.resolve(__dirname, "../../src/styles/dist/app.css"), to: "../css"},
              ]
            }
        ),
        new webpack.EnvironmentPlugin(['ENV_MSSearchAppClientId', 'ENV_MSSearchAppScopes']) // Will be replaced in the app.ts by current env values at bundle time
    ],
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "../../dist/public/js"),
        clean: true,
        publicPath: "auto", // Ensure the bundle chunks will be resovled correctly if served from a CDN
    }
};
