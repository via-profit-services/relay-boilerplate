import { createStore, StoreEnhancer } from 'redux';

import createReducer from './reducer';

type WindowWithReduxDevTools = Window & { __REDUX_DEVTOOLS_EXTENSION__: () => StoreEnhancer };

const hasDevTools = (wnd: unknown): wnd is WindowWithReduxDevTools =>
  typeof wnd === 'object' && wnd !== null && '__REDUX_DEVTOOLS_EXTENSION__' in wnd;

const createReduxStore = (initialState: ReduxStore) => {
  const reducer = createReducer(initialState);
  const store = createStore(
    reducer,
    typeof window === 'object' && hasDevTools(window)
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : undefined,
  );

  return store;
};

export default createReduxStore;
