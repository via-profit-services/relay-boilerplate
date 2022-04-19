import * as React from 'react';
import styled from '@emotion/styled';

import HeaderMenu, { HeaderMenuProps } from '~/components/HeaderMenu';
import HeaderToolbar from '~/components/Header/HeaderToolbar';

export interface HeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  readonly fragmentRef: HeaderMenuProps['fragmentRef'] | null;
}

const Container = styled.header`
  z-index: ${({ theme }) => theme.zIndex.header};
  background-color: #fff;
  box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
  position: sticky;
  height: 3rem;
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
  const { fragmentRef, ...otherProps } = props;

  return (
    <Container {...otherProps} ref={ref}>
      <Inner>
        {fragmentRef && <HeaderMenu fragmentRef={fragmentRef} />}
        <HeaderToolbar />
      </Inner>
    </Container>
  );
};

export default React.forwardRef(Header);
