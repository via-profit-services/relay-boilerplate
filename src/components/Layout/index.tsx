import * as React from 'react';
import styled from 'styled-components';
import { Outlet } from 'react-router-dom';

import AppMenu from '~/components/AppMenu';

const Container = styled.div`
  display: flex;
  flex-flow: column;
  background-color: ${({ theme }) => theme.colors.defaultBackground};
  color: ${({ theme }) => theme.colors.defaultText};
`;

const Content = styled.div`
  padding: 20px;
  flex: 1;
`;

const Layout: React.FC = () => (
  <Container>
    <AppMenu />
    <Content>
      <Outlet />
    </Content>
  </Container>
);

export default Layout;
