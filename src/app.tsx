import * as React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider as ReduxProvider } from 'react-redux';
import loadable, { loadableReady } from '@loadable/component';
import Cookies from 'js-cookie';

import RelayProvider from '~/providers/RelayProvider';
import createReduxStore from '~/redux/store';
import reduxDefaultState from '~/redux/defaultState';

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
  const isValidThemeName = (value: any): value is ThemeVariants =>
    ['standardLight', 'standardDark'].includes(value);
  const isValidLocaleName = (value: any): value is LocaleVariants => ['ru', 'en'].includes(value);
  const theme = Cookies.get('theme');
  const locale = Cookies.get('locale');

  const reduxState: ReduxState = {
    ...reduxDefaultState,
    ...preloadedStates.REDUX,
    theme: isValidThemeName(theme) ? theme : reduxDefaultState.theme,
    locale: isValidLocaleName(locale) ? locale : reduxDefaultState.locale,
  };

  const reduxStore = createReduxStore(reduxState);
  const rootElement = document.getElementById('app');

  const AppData = (
    <BrowserRouter>
      <ReduxProvider store={reduxStore}>
        <RelayProvider>
          <App />
        </RelayProvider>
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
