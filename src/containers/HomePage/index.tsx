import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(Link)`
  padding: 4px 2px;
  color: ${({ theme }) => theme.colors.defaultText};
`;

const HomePage: React.FC = () => (
  <>
    <h1>HomePage</h1>
    <nav>
      <StyledLink to="/admin">Go to admin panel</StyledLink>
    </nav>
  </>
);

export default HomePage;
