const webpack = require('webpack')
const path = require('path')
const merge = require('lodash.merge');
const commonConfig = require('./common')

const config = {
    entry: {
        main: [
            undefined,
            'webpack-hot-middleware/client'
        ]
    },
    plugins: [
        undefined,
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'inline-source-map'
}


module.exports = function(app) {
    const compiler = webpack(merge(config, commonConfig))
    app.use(
        require('webpack-dev-middleware')(compiler, {
            noInfo: true,
            publicPath: commonConfig.output.publicPath
        })
    )
    app.use(require('webpack-hot-middleware')(compiler))
}
