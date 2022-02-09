import { createStore, Middleware, applyMiddleware, compose } from 'redux';

import createReducer from '~/redux/reducer';
import defaultState from '~/redux/defaultState';

const createReduxStore = (initialState: ReduxState = defaultState) => {
  const reducer = createReducer(initialState);
  const middleware: Middleware[] = [];
  const composeEnhancers =
    typeof window === 'object' && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
          // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        })
      : compose;

  const enhancer = composeEnhancers(applyMiddleware(...middleware));

  const store = createStore(reducer, enhancer);

  return store;
};

export default createReduxStore;
