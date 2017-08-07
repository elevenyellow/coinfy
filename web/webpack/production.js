const webpack = require('webpack')
const path = require('path')
const merge = require('lodash.merge');
const commonConfig = require('./common')

const config = {
    output: {
        path: path.resolve('public/static/bundle')
    },
    plugins: [
        undefined,
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
}

module.exports = merge(config, commonConfig)