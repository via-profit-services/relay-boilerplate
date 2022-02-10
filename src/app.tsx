import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { RelayEnvironmentProvider } from 'react-relay/hooks';
import loadable, { loadableReady } from '@loadable/component';
import Cookies from 'js-cookie';

import type { ServerToClientTransfer } from 'common';
import createReduxStore from '~/redux/store';
import reduxDefaultState from '~/redux/defaultState';
import environmentFactory from '~/environment';

const App = loadable(() => import('~/containers/App/index'));

const bootstrap = async () => {
  const reduxState: ReduxState = { ...reduxDefaultState };
  let environmentVariables = {
    GRAPHQL_ENDPOINT: '',
    SUBSCRIPTION_ENDPOINT: '',
  };

  // parse preloaded states from base64 string
  if (typeof window !== 'undefined' && (window as any)?.__PRELOADED_STATES__) {
    const statesStr = (window as any).__PRELOADED_STATES__ || '';
    delete (window as any).__PRELOADED_STATES__;
    try {
      const decodedStatesStr = window.atob(statesStr.replace(/</g, '\\u003c'));
      const preloadedStates = JSON.parse(decodedStatesStr) as Partial<ServerToClientTransfer>;

      environmentVariables = {
        ...environmentVariables,
        ...preloadedStates.ENVIRONMENT,
      };

      const isValidThemeName = (value: any): value is ThemeVariants =>
        ['standardLight', 'standardDark'].includes(value);
      const isValidLocaleName = (value: any): value is LocaleVariants =>
        ['ru', 'en'].includes(value);
      const theme = Cookies.get('theme');
      const locale = Cookies.get('locale');

      reduxState.theme = isValidThemeName(theme) ? theme : reduxState.theme;
      reduxState.locale = isValidLocaleName(locale) ? locale : reduxState.locale;
    } catch (err) {
      console.error('Failed to parse environment data', err);
    }
  }

  const { GRAPHQL_ENDPOINT, SUBSCRIPTION_ENDPOINT } = environmentVariables;
  const reduxStore = createReduxStore(reduxState);
  const rootElement = document.getElementById('app');
  const environment = environmentFactory({
    graphqlEndpoint: GRAPHQL_ENDPOINT,
    subscriptionsEndpoint: SUBSCRIPTION_ENDPOINT,
  });
  const AppData = (
    <BrowserRouter>
      <ReduxProvider store={reduxStore}>
        <RelayEnvironmentProvider environment={environment}>
          <App />
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
