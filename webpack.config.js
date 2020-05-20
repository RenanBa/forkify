const path = require('path')

module.exports = {
    // entry: ['./src/js/index.js']
    entry: './src/js/index.js',  // file to look when the experiment is started
    output: {
        path: path.resolve(__dirname, 'dist/js'), // this bundle the dist folder in one js file
        filename: 'bundle.js'
    },
    mode: 'development'
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