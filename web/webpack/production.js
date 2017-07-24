const webpack = require('webpack')
const path = require('path')

module.exports = {
    entry: {
        index: './client/index.js'
    },
    output: {
        path: path.resolve('dist'),
		filename: '[name].bundle.js',
		publicPath: '/'
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
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: ({ resource }) => /node_modules/.test(resource),
        })
    ]
};
