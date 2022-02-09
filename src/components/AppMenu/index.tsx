import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  background-color: #dbdbdb;
`;

const StyledLink = styled(Link)`
  padding: 4px 2px;
`;

const AppMenu: React.FC = () => (
  <Container>
    <StyledLink to="/dashboard">Dashboard</StyledLink>
    <StyledLink to="/deals">Deals</StyledLink>
    <StyledLink to="/users">Users</StyledLink>
  </Container>
);

export default AppMenu;
