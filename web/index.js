const express = require('express');
const webpack = require('webpack');
const webpackConfig = require('./webpack/development.js')();
const createWebpackMiddleware = require('webpack-dev-middleware');
const createWebpackHotMiddleware = require('webpack-hot-middleware');
const path = require('path');

const compiler = webpack(webpackConfig);
const app = express();
app.use('/', express.static(path.resolve(__dirname, './dist')));
const webpackDevMiddleware = createWebpackMiddleware(compiler, {
  quiet: true,
  noInfo: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  publicPath: '/app',
});
app.use(webpackDevMiddleware);
app.use(createWebpackHotMiddleware(compiler));
app.listen(8001, () => console.log('App listening on http://localhost:8001'));
