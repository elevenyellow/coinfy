const webpack = require('webpack');
const path = require('path');
const createWebpackMiddleware = require('webpack-dev-middleware');
const createWebpackHotMiddleware = require('webpack-hot-middleware');

const config = {
    devtool: 'inline-source-map',
    entry: {
        main: [
            'webpack-hot-middleware/client',
            path.resolve(__dirname, '../src/client/index.js')
        ]
    },
    output: {
        filename: '[name].js',
        publicPath: '/bundle/'
    },
    resolve: {
        extensions: ['.js'],
        alias: {
            react: 'preact-compat',
            'react-dom': 'preact-compat'
        }
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: [/node_modules/]
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: ({ resource }) => /node_modules/.test(resource)
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin()
    ]
};

const compiler = webpack(config);

module.exports = function(app) {
    app.use(
        createWebpackMiddleware(compiler, {
            quiet: true,
            noInfo: true,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            publicPath: config.output.publicPath
        })
    );
    app.use(createWebpackHotMiddleware(compiler));
};
