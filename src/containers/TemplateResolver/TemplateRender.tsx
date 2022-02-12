import * as React from 'react';
import { usePreloadedQuery, PreloadedQuery, graphql } from 'react-relay';
import loadable from '@loadable/component';

import query, { TemplateRenderQuery } from '~/relay/artifacts/TemplateRenderQuery.graphql';
import LoadingIndicator from '~/components/both/LoadingIndicator';

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

const TemplateRender: React.FC<Props> = props => {
  const { preloadedQuery } = props;
  const { webpages } = usePreloadedQuery<TemplateRenderQuery>(query, preloadedQuery);
  const { template } = webpages.resolvePage;

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
};

export default TemplateRender;
