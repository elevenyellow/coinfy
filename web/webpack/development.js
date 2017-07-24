const webpack = require('webpack');
const createWebpackMiddleware = require('webpack-dev-middleware');
const createWebpackHotMiddleware = require('webpack-hot-middleware');
const path = require('path');

const config = {
  devtool: 'inline-source-map',
  entry: {
    main: [
      'webpack-hot-middleware/client',
      path.resolve(__dirname, '../client/index.js')
    ],
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/app',
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      'react': 'preact-compat',
      'react-dom': 'preact-compat',
    },
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/]
      },
    ],
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
}

const compiler = webpack(config);

const webpackDevMiddleware = createWebpackMiddleware(compiler, {
  quiet: true,
  noInfo: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  publicPath: '/app',
});


module.exports = function(app) {
  app.use(webpackDevMiddleware);
  app.use(createWebpackHotMiddleware(compiler));
}