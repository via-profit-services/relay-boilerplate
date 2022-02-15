import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Outlet } from 'react-router-dom';

import AdminAppMenu from '~/components/public/both/AdminAppMenu';

const Wrapper = styled.div`
  flex: 1;
  background-color: ${props => props.theme.colors.defaultBackground};
`;

const Layout = styled(ContentArea)`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
`;

const Aside = styled.aside`
  width: 250px;
  padding-top: 1em;
  padding-bottom: 1em;
  padding-right: ${props => props.theme.grid.desktop.gutter}px;
  border-right: 1px solid ${({ theme }) => theme.color.grey[300]};
`;

const Main = styled.main`
  flex: 1;
  width: calc(100% - 250px);
  padding: 0 ${props => props.theme.grid.desktop.gutter}px;
`;

const Article = styled.article``;

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    background-color: ${({ theme }) => theme.colors.defaultBackground};
    color: ${({ theme }) => theme.colors.defaultText};
  }
`;

const AdminLayoutDesktop: React.FC = () => (
  <>
    <GlobalStyles />
    <Container>
      <AdminAppMenu />
      <Content>
        <Outlet />
      </Content>
    </Container>
  </>
);

export default AdminLayoutDesktop;
