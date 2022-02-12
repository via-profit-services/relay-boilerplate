import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import loadable from '@loadable/component';

const AdminLayoutDesktop = loadable(() => import('~/templates/AdminLayout/AdminLayoutDesktop'));
const AdminPage = loadable(() => import('~/containers/AdminPage/index'));
const Dashboard = loadable(() => import('~/containers/Dashboard/index'));
const Users = loadable(() => import('~/containers/Users/index'));
const DealsIndex = loadable(() => import('~/containers/Deals/index'));
const DealsPipeLine = loadable(() => import('~/containers/Deals/Pipeline/index'));
const DealsList = loadable(() => import('~/containers/Deals/DealsList/index'));
const WebPage = loadable(() => import('~/containers/WebPage'));

export const RootRouter: React.FC = () => (
  <Routes>
    <Route path="/admin" element={<AdminLayoutDesktop />}>
      <Route path="/admin" element={<AdminPage />} />
      <Route path="deals" element={<DealsIndex />} />
      <Route path="deals/list" element={<DealsList />} />
      <Route path="deals/pipeline" element={<DealsPipeLine />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="users" element={<Users />} />
      <Route
        path="*"
        element={
          <main style={{ padding: '1rem' }}>
            <p>There&apos;s nothing here!</p>
          </main>
        }
      />
    </Route>

    <Route path="/*" element={<WebPage />} />
  </Routes>
);

export default RootRouter;
