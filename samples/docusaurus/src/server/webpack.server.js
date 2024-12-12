const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: "production",
    devtool: "source-map",
    optimization: {
        minimize: false
    },
    entry: path.resolve(__dirname, "./server.ts"),
    target: "node",
    externalsPresets: { node: true }, // in order to ignore built-in modules like path, fs, etc.
    module: {
        rules: [
            {
                test: /src\/server\/\.ts?$/,
                use: [                           
                {
                    loader: "ts-loader"
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
        new CopyWebpackPlugin(
            {
              patterns: [
                { from: path.resolve(__dirname, "./web.config") },
                { from: path.resolve(__dirname, "../../build"), to: "build" }
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
