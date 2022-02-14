import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import loadable, { loadableReady } from '@loadable/component';
import { RelayEnvironmentProvider } from 'react-relay';
import { Environment, Network, Store, RecordSource } from 'relay-runtime';
import Cookies from 'js-cookie';

import relayFetch from '~/relay/relay-fetch';
import relaySubscribe from '~/relay/relay-subscribe';
import createReduxStore from '~/redux/store';
import reduxDefaultState from '~/redux/defaultState';
import ErrorBoundary from '~/components/both/ErrorBoundary';

const App = loadable(() => import('~/containers/App/index'));

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

  const allowedThemes: ThemeVariants[] = ['standardLight', 'standardDark'];
  const allowedLocales: LocaleVariants[] = ['ru-RU'];
  const theme = (Cookies.get('theme') || '') as ThemeVariants;
  const locale = (Cookies.get('locale') || '') as LocaleVariants;

  const reduxState: ReduxState = {
    ...reduxDefaultState,
    ...preloadedStates.REDUX,
    theme: allowedThemes.includes(theme) ? theme : reduxDefaultState.theme,
    locale: allowedLocales.includes(locale) ? locale : reduxDefaultState.locale,
  };

  const reduxStore = createReduxStore(reduxState);
  const relayStore = new Store(new RecordSource(preloadedStates.RELAY?.store));
  const relayNetwork = Network.create(
    relayFetch(preloadedStates.RELAY?.graphqlEndpoint || ''),
    relaySubscribe(preloadedStates.RELAY?.graphqlSubscriptions || ''),
  );
  const rootElement = document.getElementById('app');
  const environment = new Environment({
    isServer: false,
    store: relayStore,
    network: relayNetwork,
  });

  const AppData = (
    <BrowserRouter>
      <ReduxProvider store={reduxStore}>
        <RelayEnvironmentProvider environment={environment}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </RelayEnvironmentProvider>
      </ReduxProvider>
    </BrowserRouter>
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
