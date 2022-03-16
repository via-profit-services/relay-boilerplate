import * as React from 'react';
import { usePreloadedQuery, PreloadedQuery, graphql } from 'react-relay';
import loadable from '@loadable/component';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import { IntlProvider } from 'react-intl';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

import query, { TemplateRenderQuery } from '~/relay/artifacts/TemplateRenderQuery.graphql';
import LoadingIndicator from '~/components/both/LoadingIndicator';
import translationsruRU from '~/translations/ru-RU.json';
import themeStandardLight from '~/themes/standardLight';
import themeStandardDark from '~/themes/standardDark';
import GlobalStyles from '~/containers/WebPage/GlobalStyles';

graphql`
  query TemplateRenderQuery($path: String!) {
    webpages {
      resolvePage(path: $path) {
        id
        statusCode
        availability
        template {
          __typename
          ...WebTemplateHomeDesktopFragment
          ...WebTemplateFallbackDesktopFragment
          ...WebTemplateSecondDesktopFragment
          ...WebTemplateContactDesktopFragment
        }
      }
    }
  }
`;

type Props = {
  preloadedQuery: PreloadedQuery<TemplateRenderQuery>;
};

const WebTemplateHomeDesktop = loadable(() => import('~/templates/WebTemplateHomeDesktop/index'), {
  fallback: <LoadingIndicator />,
});
const WebTemplateFallbackDesktop = loadable(
  () => import('~/templates/WebTemplateFallbackDesktop/index'),
  {
    fallback: <LoadingIndicator />,
  },
);
const WebTemplateSecondDesktop = loadable(
  () => import('~/templates/WebTemplateSecondDesktop/index'),
  {
    fallback: <LoadingIndicator />,
  },
);
const WebTemplateContactDesktop = loadable(
  () => import('~/templates/WebTemplateContactDesktop/index'),
  {
    fallback: <LoadingIndicator />,
  },
);

const localeMap: Record<LocaleName, Record<string, string>> = {
  'ru-RU': translationsruRU,
};

const themesMap: Record<ThemeName, DefaultTheme> = {
  standardLight: themeStandardLight,
  standardDark: themeStandardDark,
};

const selector = createSelector(
  (store: ReduxStore) => store.ui.theme,
  (store: ReduxStore) => store.ui.locale,
  (store: ReduxStore) => store.ui.fontSize,
  (theme, locale, fontSize) => ({ theme, locale, fontSize }),
);

const TemplateRender: React.FC<Props> = props => {
  const { preloadedQuery } = props;
  const state = useSelector(selector);
  const { webpages } = usePreloadedQuery<TemplateRenderQuery>(query, preloadedQuery);
  const { template } = webpages.resolvePage;

  const messages = localeMap[state.locale] || localeMap['ru-RU'];
  const locale = state.locale in localeMap ? state.locale : 'ru-RU';
  const theme = React.useMemo(
    () => themesMap[state.theme] || themesMap.standardLight,
    [state.theme],
  );

  const renderTemplate = React.useCallback(() => {
    switch (template.__typename) {
      case 'WebTemplateHome':
        return <WebTemplateHomeDesktop fragmentRef={template} />;

      case 'WebTemplateSecond':
        return <WebTemplateSecondDesktop fragmentRef={template} />;

      case 'WebTemplateFallback':
        return <WebTemplateFallbackDesktop fragmentRef={template} />;

      case 'WebTemplateContact':
        return <WebTemplateContactDesktop fragmentRef={template} />;

      default:
        return null;
    }
  }, [template]);

  return (
    <IntlProvider locale={locale} messages={messages}>
      <ThemeProvider theme={theme}>
        <GlobalStyles fontSize={state.fontSize} />
        {renderTemplate()}
      </ThemeProvider>
    </IntlProvider>
  );
};

export default TemplateRender;
