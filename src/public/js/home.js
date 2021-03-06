import babelPolyfill from 'babel-polyfill'; // eslint-disable-line no-unused-vars
import React from 'react';
import history from './common/history';
import ReactDom from 'react-dom';
import Root from './containers/Root';
import routes from './routes/home';
import homeReducer from './redux/homeReducer';
import './common/airlog';
import {
  applyMiddleware,
  compose,
  createStore,
} from 'redux';
import thunk from 'redux-thunk';
import ticker from './common/ticker';

window.scott = true;

let createStoreWithMiddleware;
const middleware = applyMiddleware(thunk);
createStoreWithMiddleware = compose(middleware);
const store = createStoreWithMiddleware(createStore)(
  homeReducer, {}
);

window.dispatch = store.dispatch;

window.addEventListener('load', () => {
  ReactDom.render(<Root history={history} routes={routes} store={store} />, document.getElementById('app'));
  ticker.start();
});


