import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import loadable, { loadableReady } from '@loadable/component';
import { RelayEnvironmentProvider } from 'react-relay';
import { Environment, Network, Store, RecordSource } from 'relay-runtime';
import { Provider as ReduxProvider } from 'react-redux';

import reduxDefaultState from '~/redux/defaultState';
import createReduxStore from '~/redux/store';
import relayFetch from '~/relay/utils/relay-fetch';
import relaySubscribe from '~/relay/utils/relay-subscribe';
import ErrorBoundary from '~/components/both/ErrorBoundary';

const RootRouter = loadable(() => import('~/routes/RootRouter'));

const bootstrap = async () => {
  // parse preloaded states from base64 string
  // if (typeof window !== 'undefined' && (window as any)?.__PRELOADED_STATES__) {
  const statesStr: string = (window as any).__PRELOADED_STATES__ || '';
  delete (window as any).__PRELOADED_STATES__;

  const preloadedStates = JSON.parse(
    decodeURIComponent(
      window
        .atob(statesStr)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    ),
  ) as Partial<PreloadedStates>;

  const reduxStore = createReduxStore({
    ...reduxDefaultState,
    ...preloadedStates.REDUX?.store,
  });

  const relayStore = new Store(new RecordSource(preloadedStates.RELAY?.store));
  const relayNetwork = Network.create(
    relayFetch(preloadedStates.RELAY?.graphqlEndpoint || ''),
    relaySubscribe(preloadedStates.RELAY?.graphqlSubscriptions || ''),
  );
  const relayEnvironment = new Environment({
    isServer: false,
    store: relayStore,
    network: relayNetwork,
  });

  const rootElement = document.getElementById('app');
  const AppData = (
    <ErrorBoundary>
      <BrowserRouter>
        <ReduxProvider store={reduxStore}>
          <RelayEnvironmentProvider environment={relayEnvironment}>
            <RootRouter />
          </RelayEnvironmentProvider>
        </ReduxProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );

  await loadableReady();

  if (process.env.NODE_ENV === 'development') {
    ReactDOM.render(AppData, rootElement);
  }

  if (process.env.NODE_ENV !== 'development') {
    ReactDOM.hydrate(AppData, rootElement);
  }
};

bootstrap();
