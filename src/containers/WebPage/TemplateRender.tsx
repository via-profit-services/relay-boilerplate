import * as React from 'react';
import { usePreloadedQuery, PreloadedQuery, graphql } from 'react-relay';
import loadable from '@loadable/component';
import { ThemeProvider, DefaultTheme } from 'styled-components';
import { IntlProvider } from 'react-intl';

import query, {
  TemplateRenderQuery,
  LocaleName,
  ThemeName,
} from '~/relay/artifacts/TemplateRenderQuery.graphql';
import LoadingIndicator from '~/components/both/LoadingIndicator';
import translationsruRU from '~/translations/ru-RU.json';
import themeStandardLight from '~/themes/standardLight';
import themeStandardDark from '~/themes/standardDark';
import GlobalStyles from '~/containers/WebPage/GlobalStyles';

graphql`
  query TemplateRenderQuery($path: String!) {
    localStore {
      locale
      fontSize
      theme
    }
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

const localeMap: Record<Exclude<LocaleName, '%future added value'>, Record<string, string>> = {
  ru_RU: translationsruRU,
};

const themesMap: Record<Exclude<ThemeName, '%future added value'>, DefaultTheme> = {
  standardLight: themeStandardLight,
  standardDark: themeStandardDark,
};

const TemplateRender: React.FC<Props> = props => {
  const { preloadedQuery } = props;
  const { webpages, localStore } = usePreloadedQuery<TemplateRenderQuery>(query, preloadedQuery);
  const { template } = webpages.resolvePage;

  const messages = localeMap[localStore.locale] || localeMap.ru_RU;
  const locale = localStore.locale in localeMap ? localStore.locale : 'ru_RU';
  const theme = React.useMemo(
    () => themesMap[localStore.theme] || themesMap.standardLight,
    [localStore.theme],
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
    <IntlProvider locale={locale.replace('_', '-')} messages={messages}>
      <ThemeProvider theme={theme}>
        <GlobalStyles fontSize={localStore.fontSize} />
        {renderTemplate()}
      </ThemeProvider>
    </IntlProvider>
  );
};

export default TemplateRender;
