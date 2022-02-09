import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { RelayEnvironmentProvider } from 'react-relay/hooks';

import type { ServerToClientTransfer } from 'common';
import App from '~/containers/App';
import createReduxStore from '~/redux/store';
import reduxDefaultState from '~/redux/defaultState';
import environmentFactory from '~/environment';

const bootstrap = async () => {
  let reduxState = { ...reduxDefaultState };
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

      reduxState = {
        ...reduxState,
        ...preloadedStates.REDUX,
      };
    } catch (err) {
      console.error('Failed to parse environment data', err);
    }
  }

  // merge local storage data
  if (typeof window !== 'undefined') {
    try {
      const localDefaultState = JSON.parse(localStorage.getItem('@ReduxState') || '');
      reduxState = {
        ...reduxState,
        ...localDefaultState,
      };
    } catch (err) {
      // do nothing
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

  ReactDOM.render(AppData, rootElement);
};

bootstrap();
