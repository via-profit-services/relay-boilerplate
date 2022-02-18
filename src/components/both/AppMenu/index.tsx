import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  position: sticky;
  top: 0;
  background: #b9baf9;
  padding: 20px;
  box-shadow: 0 5px 12px #0a011252;
`;

const StyledLink = styled(Link)`
  padding: 4px 8px;
  color: #000;
`;

const AppMenu: React.FC = () => (
  <Container>
    <StyledLink to="/">Home page</StyledLink>
    <StyledLink to="/about">About</StyledLink>
    <StyledLink to="/info">Information</StyledLink>
    <StyledLink to="/contact">Contact</StyledLink>
    <StyledLink to="/not-found">Not found</StyledLink>
  </Container>
);

export default AppMenu;