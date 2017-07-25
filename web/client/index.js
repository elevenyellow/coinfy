import React from 'react';
import { render } from 'react-dom';
import App from '/components/App.js';

const container = document.querySelector('#app');

function renderApp() {
  const app = (<App />);
  render(app, container);
}

// Set up HMR re-rendering.
if (module.hot) {
    module.hot.accept();
    module.hot.accept('./components/App.js', renderApp);
}

// Initial render.
renderApp();
