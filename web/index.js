const express = require('express');
const path = require('path');
const webpack = require('./webpack/development')
const app = express()


webpack(app)
app.use('/', express.static(path.resolve(__dirname, './dist')))
app.listen(8001, () => console.log('App listening on http://localhost:8001'))