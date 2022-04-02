import * as React from 'react';

import ButtonStandard, { ButtonStandardProps } from '~/components/Button/ButtonStandard';
import ButtonAccent, { ButtonAccentProps } from '~/components/Button/ButtonAccent';

interface BaseProps {
  readonly variant?: 'standard' | 'accent';
}

export type ButtonProps = (ButtonStandardProps & BaseProps) | (ButtonAccentProps & BaseProps);

const isAccent = (props: ButtonProps): props is ButtonAccentProps =>
  'variant' in props && props.variant === 'accent';

const isStandard = (props: ButtonProps): props is ButtonStandardProps =>
  ('variant' in props && props.variant === 'standard') || typeof props.variant === 'undefined';

const Button: React.ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (props, ref) => {
  if (isStandard(props)) {
    return <ButtonStandard {...props} ref={ref} />;
  }

  if (isAccent(props)) {
    return <ButtonAccent {...props} ref={ref} />;
  }

  const { variant } = props;

  throw new Error(`Expected «variant» property one of: [standard, accent], but got «${variant}»`);
};

export default React.forwardRef(Button);
