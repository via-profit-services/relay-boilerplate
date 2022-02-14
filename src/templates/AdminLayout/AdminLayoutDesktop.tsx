import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { Outlet } from 'react-router-dom';

import AdminAppMenu from '~/components/both/AdminAppMenu';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  min-height: 100vh;
`;

const Content = styled.div`
  padding: 20px;
  flex: 1;
`;

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
