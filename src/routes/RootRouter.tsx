import * as React from 'react';
import { Routes, Route } from 'react-router-dom';

import Layout from '~/components/Layout';

const Dashboard = React.lazy(() => import('~/containers/Dashboard/index'));
const Users = React.lazy(() => import('~/containers/Users/index'));
const DealsIndex = React.lazy(() => import('~/containers/Deals/index'));
const DealsPipeLine = React.lazy(() => import('~/containers/Deals/Pipeline/index'));
const DealsList = React.lazy(() => import('~/containers/Deals/DealsList/index'));

export const RootRouter: React.FC = () => (
  <React.Suspense fallback={<div>Loading routes...</div>}>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/deals" element={<DealsIndex />} />
        <Route path="/deals/list" element={<DealsList />} />
        <Route path="/deals/pipeline" element={<DealsPipeLine />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/users" element={<Users />} />
        <Route
          path="*"
          element={
            <main style={{ padding: '1rem' }}>
              <p>There&apos;s nothing here!</p>
            </main>
          }
        />
      </Route>
    </Routes>
  </React.Suspense>
);

export default RootRouter;
