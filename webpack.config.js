const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    // entry: ['./src/js/index.js']
    entry: './src/js/index.js',  // file to look when the experiment is started
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
    ]
};


// babel file
/*
{
    "presets": [
        ["@babel/env", {
            "useBuiltIns": "usage",
            "corejs": "3",
            "targets": {
                "browsers": [
                    "last 5 versions",
                    "ie >= 8"
                ]
            }
        }
    ]
}
*/