import * as React from 'react';
import styled from '@emotion/styled';

import IconChevronLeft from '~/components/Icons/IconChevronLeft';
import IconChevronRight from '~/components/Icons/IconChevronRight';

export type Direction = 'prev' | 'next';

export interface SliderControlProps extends React.HTMLAttributes<HTMLButtonElement> {
  direction: Direction;
}

const Container = styled.button<{ direction: Direction }>`
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  font-size: 2em;
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: center;
  background: none;
  border: 0;
  width: auto;
  height: auto;
  cursor: pointer;
  z-index: 2;
`;

const SliderControlRef: React.ForwardRefRenderFunction<HTMLButtonElement, SliderControlProps> = (
  props,
  ref,
) => {
  const { direction, ...otherProps } = props;

  return (
    <Container direction={direction} ref={ref} {...otherProps}>
      {direction === 'prev' && <IconChevronLeft />}
      {direction === 'next' && <IconChevronRight />}
    </Container>
  );
};

export const SliderControl = React.forwardRef(SliderControlRef);
export default SliderControl;
