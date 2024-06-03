const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = merge(common, {
    mode: "development",
    devtool: "eval-source-map",    
    plugins: [
        new NodemonPlugin({
            script: './dist/server.js',
            args: ['--exec node','--signal SIGINT','-r ts-node/register'],
            nodeArgs: ['--inspect=9239'],
            ext: 'js,html',
            watch:  path.resolve(__dirname, "../../dist"),
            delay: '1000'
        })
    ]
});