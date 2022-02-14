import * as React from 'react';
import styled from 'styled-components';
import ChevronLeftIcon from 'mdi-react/ChevronLeftIcon';
import ChevronRightIcon from 'mdi-react/ChevronRightIcon';

type Direction = 'prev' | 'next';

export type ArrowProps = {
  direction: Direction;
  onClick: () => void;
};

const Container = styled.a<{ direction: Direction }>`
  position: absolute;
  top: 50%;
  left: ${({ direction }) => (direction === 'prev' ? 0 : 'inherit')};
  right: ${({ direction }) => (direction === 'next' ? 0 : 'inherit')};
  transform: translate(0, -50%);
  font-size: 2em;
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: center;
`;

const Arrow: React.FC<ArrowProps> = props => {
  const { direction, onClick } = props;

  const href = `#founder-slider-${direction}-control`;
  const handleOnClick: React.MouseEventHandler<HTMLAnchorElement> = event => {
    event.preventDefault();

    onClick();
  };

  return (
    <Container href={href} onClick={handleOnClick} direction={direction}>
      {direction === 'prev' && <ChevronLeftIcon size="1em" color="currentColor" />}
      {direction === 'next' && <ChevronRightIcon size="1em" color="currentColor" />}
    </Container>
  );
};

export default Arrow;
