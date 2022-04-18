import * as React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { Provider as ReduxProvider } from 'react-redux';
import createCache from '@emotion/cache';
import { CacheProvider as CSSCacheProvider } from '@emotion/react';

import reduxDefaultState from '~/redux/defaultState';
import createReduxStore from '~/redux/store';
import RootRouter from '~/routes/RootRouter';
import RelayProvider from '~/providers/RelayProvider';

const bootstrap = async () => {
  // parse preloaded states from base64 string
  // if (typeof window !== 'undefined' && (window as any)?.__PRELOADED_STATES__) {
  const statesStr: string = (window as any).__PRELOADED_STATES__ || '';
  delete (window as any).__PRELOADED_STATES__;

  let preloadedStates: Partial<PreloadedStates> = {};

  try {
    preloadedStates = JSON.parse(
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
  } catch (err) {
    console.error('Failed to parse preloaded state');
    console.error(err);
  }

  // Parse the local storage and fill the tokens into redux store
  let accessToken: AccessToken | null =
    preloadedStates?.REDUX?.accessToken || reduxDefaultState.accessToken;
  let refreshToken: RefreshToken | null =
    preloadedStates?.REDUX?.refreshToken || reduxDefaultState.refreshToken;
  try {
    const plainAuthData = JSON.parse(window.localStorage.getItem('authorization') || '{}');
    if (
      typeof plainAuthData === 'object' &&
      typeof plainAuthData?.accessToken === 'object' &&
      typeof plainAuthData?.refreshToken === 'object'
    ) {
      accessToken = plainAuthData.accessToken as AccessToken;
      refreshToken = plainAuthData.refreshToken as RefreshToken;
    }
  } catch (err) {
    console.error('Failed to parse local storage');
    console.error(err);
  }

  const reduxStore = createReduxStore({
    ...reduxDefaultState,
    ...preloadedStates.REDUX,
    accessToken,
    refreshToken,
  });

  const rootElement = document.getElementById('app');
  if (!rootElement) {
    throw new Error('Root element with id #app not found');
  }
  const cssCache = createCache({ key: 'app' });
  const AppData = (
    <ReduxProvider store={reduxStore}>
      <RelayProvider storeRecords={preloadedStates?.RELAY}>
        <BrowserRouter>
          <CSSCacheProvider value={cssCache}>
            <RootRouter />
          </CSSCacheProvider>
        </BrowserRouter>
      </RelayProvider>
    </ReduxProvider>
  );

  await loadableReady();

  if (process.env.NODE_ENV !== 'development') {
    hydrateRoot(rootElement, AppData);
  }

  if (process.env.NODE_ENV === 'development') {
    const root = createRoot(rootElement);
    root.render(AppData);
  }
};

bootstrap();
