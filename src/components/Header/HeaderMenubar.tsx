import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from '@emotion/styled';

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  flex: 1;
`;

const StyledLink = styled(Link)`
  padding: 4px 8px;
  color: #000;
`;

const HeaderMenubar: React.FC = () => (
  <Container>
    <StyledLink to="/">Home page</StyledLink>
    <StyledLink to="/about">About</StyledLink>
    <StyledLink to="/info">Information</StyledLink>
    <StyledLink to="/contact">Contact</StyledLink>
    <StyledLink to="/not-found">Not found</StyledLink>
  </Container>
);

export default HeaderMenubar;