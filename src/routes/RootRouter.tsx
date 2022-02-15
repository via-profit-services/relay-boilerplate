import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import loadable from '@loadable/component';

const WebPage = loadable(() => import('~/containers/WebPage'));

export const RootRouter: React.FC = () => (
  <Routes>
    <Route path="/*" element={<WebPage />} />
  </Routes>
);

export default RootRouter;
