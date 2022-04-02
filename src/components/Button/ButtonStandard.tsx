import * as React from 'react';
import styled from '@emotion/styled';

export interface ButtonStandardProps extends React.ComponentPropsWithoutRef<'button'> {
  readonly children: React.ReactNode;
}

const Button = styled.button`
  border-radius: 1.2em;
  text-decoration: none;
  padding: 1em 2em;
  cursor: pointer;
  font-size: 0.86rem;
  border: 0;
  outline: 2px solid transparent;
  transition: all 120ms ease-out 0s;
  color: #000;
  background-color: grey;
`;

const ButtonStandard: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonStandardProps> = (
  props,
  ref,
) => {
  const { children, ...otherProps } = props;

  return (
    <Button {...otherProps} ref={ref}>
      {children}
    </Button>
  );
};

export default React.forwardRef(ButtonStandard);
