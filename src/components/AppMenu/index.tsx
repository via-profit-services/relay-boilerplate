import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import ThemeSwitcherButton from './ThemeSwitcherButton';
import LocaleSwitcherButton from './LocaleSwitcherButton';

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
`;

const StyledLink = styled(Link)`
  padding: 4px 2px;
`;

const AppMenu: React.FC = () => (
  <Container>
    <StyledLink to="/dashboard">Dashboard</StyledLink>
    <StyledLink to="/deals">Deals</StyledLink>
    <StyledLink to="/users">Users</StyledLink>

    <ThemeSwitcherButton />
    <LocaleSwitcherButton />
  </Container>
);

export default AppMenu;
