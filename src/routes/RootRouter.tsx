import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import loadable from '@loadable/component';

import LoadingIndicator from '~/components/LoadingIndicator';

const WebPage = loadable(() => import('~/containers/WebPage/index'));

export const RootRouter: React.FC = () => (
  <React.Suspense fallback={<LoadingIndicator />}>
    <Routes>
      <Route path="/*" element={<WebPage />} />
    </Routes>
  </React.Suspense>
);

export default RootRouter;
