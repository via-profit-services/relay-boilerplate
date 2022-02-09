import * as React from 'react';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import { IntlProvider, ReactIntlErrorCode, IntlConfig } from 'react-intl';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';

import themeStandardLight from '~/themes/standardLight';
import themeStandardDark from '~/themes/standardDark';
import translationsEN from '~/translations/en.json';
import translationsRU from '~/translations/ru.json';
import RootRouter from '~/routes/RootRouter';

const themes = {
  standardLight: themeStandardLight,
  standardDark: themeStandardDark,
};

const translations = {
  ru: translationsRU,
  en: translationsEN,
};

const App: React.FC = () => {
  const { theme, locale } = useSelector<ReduxState, ReduxSelectedUI>(store => store);
  const intlOnError: IntlConfig['onError'] = err => {
    if (
      err.code === ReactIntlErrorCode.MISSING_TRANSLATION ||
      err.code === ReactIntlErrorCode.FORMAT_ERROR
    ) {
      return;
    }

    console.error(err);
  };

  const currentTheme: DefaultTheme = themes[theme] || themes.standardLight;
  const messages = React.useMemo(() => translations[locale] || translations.ru, [locale]);

  return (
    <IntlProvider locale={locale} messages={messages as any} onError={intlOnError}>
      <ThemeProvider theme={currentTheme}>
        <>
          <Helmet>
            <html lang="ru" />
            <meta charSet="utf-8" />
            <meta name="author" content="Via Profit" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta httpEquiv="content-type" content="text/html; charset=utf-8" />
          </Helmet>
          <RootRouter />
        </>
      </ThemeProvider>
    </IntlProvider>
  );
};

export default App;
