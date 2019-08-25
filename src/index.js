import React from 'react';
import ReactDOM from 'react-dom';

import * as serviceWorker from './serviceWorker';
import App from './App';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));

/**
 * Register service worker to provide offline capability. Use unregister to remove
 * the usage of the service worker.
 */
serviceWorker.unregister();
