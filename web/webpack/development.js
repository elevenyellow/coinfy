const webpack = require('webpack');
const path = require('path');

function configFactory() {
  return {
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
}

module.exports = configFactory;
