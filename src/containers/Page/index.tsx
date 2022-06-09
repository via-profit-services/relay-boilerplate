/* eslint-disable import/max-dependencies */
import * as React from 'react';
import { useLazyLoadQuery, graphql } from 'react-relay';
import loadable from '@loadable/component';
import { ThemeProvider, Theme } from '@emotion/react';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';

import query, { PageQuery } from '~/relay/artifacts/PageQuery.graphql';
import LoadingIndicator from '~/components/LoadingIndicator';
import translationsruRU from '~/translations/ru-RU.json';
import themeStandardLight from '~/themes/standardLight';
import themeStandardDark from '~/themes/standardDark';
import GlobalStyles from '~/containers/Page/GlobalStyles';
import faviconPng from '~/assets/favicon.png';
import faviconIco from '~/assets/favicon.ico';
import '~/assets/robots.txt';

graphql`
  query PageQuery($path: String!) {
    pages {
      resolve(path: $path) {
        id
        statusCode
        availability
        template
        ...TemplateHomeDesktopFragment
        ...TemplateSecondDesktopFragment
      }
    }
  }
`;

const TemplateHomeDesktop = loadable(() => import('~/templates/TemplateHomeDesktop/index'), {
  fallback: <LoadingIndicator />,
});

const TemplateSecondDesktop = loadable(() => import('~/templates/TemplateSecondDesktop/index'), {
  fallback: <LoadingIndicator />,
});

const localeMap: Record<LocaleName, Record<string, string>> = {
  'ru-RU': translationsruRU,
};

const themesMap: Record<ThemeName, Theme> = {
  standardLight: themeStandardLight,
  standardDark: themeStandardDark,
};

const selector = createSelector(
  (store: ReduxStore) => store.theme,
  (store: ReduxStore) => store.locale,
  (store: ReduxStore) => store.fontSize,
  (store: ReduxStore) => store.deviceMode,
  (theme, locale, fontSize, deviceMode) => ({ theme, locale, fontSize, deviceMode }),
);

const Page: React.FC = () => {
  const { pathname } = useLocation();
  const state = useSelector(selector);
  const { pages } = useLazyLoadQuery<PageQuery>(query, { path: pathname });
  const { template, ...fragmentRef } = pages.resolve;
  const messages = localeMap[state.locale] || localeMap['ru-RU'];
  const locale = state.locale in localeMap ? state.locale : 'ru-RU';
  const theme = React.useMemo(
    () => themesMap[state.theme] || themesMap.standardLight,
    [state.theme],
  );

  const renderTemplate = React.useCallback(() => {
    switch (template) {
      case 'Home':
        return <TemplateHomeDesktop fragmentRef={fragmentRef} />;

      default:
        return <TemplateSecondDesktop fragmentRef={fragmentRef} />;
    }
  }, [fragmentRef, template]);

  return (
    <>
      <Helmet htmlAttributes={{ lang: locale }}>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href={faviconPng} />
        <link rel="icon" type="image/x-icon" href={faviconIco} />
      </Helmet>
      <IntlProvider locale={locale} messages={messages}>
        <ThemeProvider theme={theme}>
          <GlobalStyles fontSize={state.fontSize} />
          {renderTemplate()}
        </ThemeProvider>
      </IntlProvider>
    </>
  );
};

export default Page;
