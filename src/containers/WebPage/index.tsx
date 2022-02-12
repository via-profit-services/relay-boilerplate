import * as React from 'react';
import { useQueryLoader } from 'react-relay';
import { useLocation } from 'react-router-dom';
import loadable from '@loadable/component';

import ErrorBoundary from '~/components/both/ErrorBoundary';
import LoadingIndicator from '~/components/both/LoadingIndicator';
import query, { TemplateRenderQuery } from '~/relay/artifacts/TemplateRenderQuery.graphql';

const TemplateRender = loadable(() => import('~/containers/WebPage/TemplateRender'), {
  fallback: <LoadingIndicator />,
});

const WebPage: React.FC = () => {
  const [preloadedQuery, loadQuery] = useQueryLoader<TemplateRenderQuery>(query);
  const { pathname } = useLocation();

  // Client Side Render
  React.useEffect(() => {
    loadQuery({ path: pathname });
  }, [loadQuery, pathname]);

  // Server Side Render
  if (typeof window === 'undefined') {
    if (!preloadedQuery) {
      loadQuery({ path: pathname });

      return null;
    }

    return <TemplateRender preloadedQuery={preloadedQuery} />;
  }

  return (
    <ErrorBoundary>
      <React.Suspense fallback={<LoadingIndicator />}>
        {preloadedQuery && <TemplateRender preloadedQuery={preloadedQuery} />}
      </React.Suspense>
    </ErrorBoundary>
  );
};

export default WebPage;
