const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // entry: ['./src/js/index.js']
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
                test: /\.js$/, // using regex to test files that ends with js
                exclude: /node_modules/, // regex to not include node_modules files folder
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};