import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom";

import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store/configureStore.js';
import routes from './routes.js';
import './style.scss';

// import 'expose?$!expose?jQuery!jquery';

const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <Router>
            {routes}
        </Router>
    </Provider>,
    document.getElementById('root')
);
