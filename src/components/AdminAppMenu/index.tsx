import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import ThemeSwitcherButton from './ThemeSwitcherButton';

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  background: #1a0202;
  padding: 20px;
  box-shadow: 0 2px 13px #00000040;
  position: sticky;
  top: 0;
`;

const StyledLink = styled(Link)`
  padding: 4px 2px;
  color: #fff;
`;

const AdminAppMenu: React.FC = () => (
  <Container>
    <StyledLink to="/">Home page</StyledLink>
    <StyledLink to="/admin/dashboard">Dashboard</StyledLink>
    <StyledLink to="/admin/deals">Deals</StyledLink>
    <StyledLink to="/admin/users">Users</StyledLink>

    <ThemeSwitcherButton />
  </Container>
);

export default AdminAppMenu;
