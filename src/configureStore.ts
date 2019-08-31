import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import { createEpicMiddleware } from 'redux-observable';

import rootEpic from './epic';
import rootReducer from './ducks';
import { isProduction } from './config';

export default (history) => {
  const reduxRouterMiddleware = routerMiddleware(history);
  const epicMiddleware = createEpicMiddleware(rootEpic);
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    !isProduction && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose;
  /* eslint-enable */
  const enhancers = composeEnhancers(applyMiddleware(reduxRouterMiddleware, epicMiddleware));

  const store = createStore(rootReducer, enhancers);

  return store;
};
