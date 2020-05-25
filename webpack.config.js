const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'],  // file to look when the experiment is started
    output: {
        path: path.resolve(__dirname, 'dist'), // this bundle the dist folder in one js file
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/, // file to transpile using regex
                exclude: /node_modules/, // we do not need to transpile other libraries
                use: {
                    loader: 'babel-loader'
                },
            }
        ]
    }
};