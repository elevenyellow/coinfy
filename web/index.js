const express = require('express')
const path = require('path')
const app = express()


if (process.env.NODE_ENV === 'development')
    require('./webpack/development')(app)


app.use('/', express.static(path.resolve(__dirname, './dist')))
app.listen(8001, () => console.log('App listening on http://localhost:8001'))