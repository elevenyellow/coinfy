import React from 'react'
import { render } from 'react-dom'
import App from '/components/App'

if (module.hot)
    module.hot.accept()

render(<App />, document.querySelector('#app'))