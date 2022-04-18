import * as React from 'react';
import styled from '@emotion/styled';

import HeaderMenubar, { MenuBarProps } from '~/components/Header/HeaderMenubar';
import HeaderToolbar from '~/components/Header/HeaderToolbar';

export interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly menu: MenuBarProps['menu'];
}

const Container = styled.header`
  z-index: ${({ theme }) => theme.zIndex.header};
  background-color: #fff;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
  position: sticky;
  height: 3rem;
  overflow-y: hidden;
  top: 0;
  display: flex;
  align-items: center;
  padding: 0 ${props => props.theme.grid.frameGutter}px;
  margin: 0 auto;
  width: 100%;
`;

const Inner = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  margin: 0 auto;
`;

const Header: React.ForwardRefRenderFunction<HTMLDivElement, HeaderProps> = (props, ref) => {
  const { menu, ...otherProps } = props;

  return (
    <Container {...otherProps} ref={ref}>
      <Inner>
        <HeaderMenubar menu={menu} />
        <HeaderToolbar />
      </Inner>
    </Container>
  );
};

export default React.forwardRef(Header);
