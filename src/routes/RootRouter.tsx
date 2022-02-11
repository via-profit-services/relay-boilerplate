import * as React from 'react';
import { Routes, Route } from 'react-router-dom';
import loadable from '@loadable/component';

const HomePageDesktop = loadable(() => import('~/templates/HomePage/HomePageDesktop'));
const AdminLayoutDesktop = loadable(() => import('~/templates/AdminLayout/AdminLayoutDesktop'));

const HomePage = loadable(() => import('~/containers/HomePage/index'));
const AboutPage = loadable(() => import('~/containers/AboutPage/index'));
const ContactPage = loadable(() => import('~/containers/ContactPage/index'));
const AdminPage = loadable(() => import('~/containers/AdminPage/index'));
const Dashboard = loadable(() => import('~/containers/Dashboard/index'));
const Users = loadable(() => import('~/containers/Users/index'));
const DealsIndex = loadable(() => import('~/containers/Deals/index'));
const DealsPipeLine = loadable(() => import('~/containers/Deals/Pipeline/index'));
const DealsList = loadable(() => import('~/containers/Deals/DealsList/index'));

export const RootRouter: React.FC = () => (
  <Routes>
    <Route path="/" element={<HomePageDesktop />}>
      <Route path="/" element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route
        path="*"
        element={
          <main style={{ padding: '1rem' }}>
            <p>Page not found</p>
          </main>
        }
      />
    </Route>
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
  </Routes>
);

export default RootRouter;
