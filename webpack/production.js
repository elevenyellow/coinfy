const webpack = require('webpack')
const path = require('path')
const merge = require('lodash.merge')
const commonConfig = require('./common')
const UglifyEsPlugin = require('uglify-es-webpack-plugin')

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
        // new webpack.optimize.UglifyJsPlugin({
        new UglifyEsPlugin({
            mangle: {
                reserved: [
                    'Buffer',
                    'BigInteger',
                    'Point',
                    'ECPubKey',
                    'ECKey',
                    'sha512_asm',
                    'asm',
                    'ECPair',
                    'HDNode'
                ]
            }
        }),
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
}

module.exports = merge(config, commonConfig)
