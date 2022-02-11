import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
`;

const StyledLink = styled(Link)`
  padding: 4px 2px;
`;

const DealsMenu: React.FC = () => (
  <Container>
    <StyledLink to="/admin/deals/pipeline">Pipeline</StyledLink>
    <StyledLink to="/admin/deals/list">List</StyledLink>
  </Container>
);
export default DealsMenu;
