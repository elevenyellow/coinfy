const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        index: './client/index.js'
        //   libs: './client/libs.js',
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].bundle.js'
    },
    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ }
        ]
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            react: 'preact-compat',
            'react-dom': 'preact-compat'
        }
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin()
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'common' // Specify the common bundle's name.
        // })
    ]
};
