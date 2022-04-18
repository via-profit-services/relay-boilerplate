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

export interface MenuBarProps {
  readonly menu: {
    readonly id: string;
    readonly items: ReadonlyArray<MenuBarItem> | null;
  };
}

export interface MenuBarItem {
  readonly id: string;
  readonly target: 'BLANK' | 'SELF' | '%future added value';
  readonly url: string | null;
  readonly name: string | null;
  readonly childs: ReadonlyArray<MenuBarItem> | null;
  readonly page: {
    readonly id: string;
    readonly name: string | null;
    readonly path: string | null;
  } | null;
}

const HeaderMenubar: React.FC<MenuBarProps> = props => {
  const { menu } = props;
  const { items } = menu;

  return (
    <Container>
      {items?.map(item => (
        <StyledLink key={item.id} to={item.url || item.page?.path || '/'}>
          {item.name || item.page?.name}
        </StyledLink>
      ))}
    </Container>
  );
};

export default HeaderMenubar;
