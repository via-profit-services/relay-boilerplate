import * as React from 'react';
import styled from 'styled-components';
import SunIcon from 'mdi-react/SunMoonStarsIcon';
import { useDispatch, useSelector } from 'react-redux';

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.defaultText};
  color: ${({ theme }) => theme.colors.defaultText};
  background: none;
  outline: none;
`;

const Icon = styled(SunIcon)`
  color: ${({ theme }) => theme.colors.defaultText};
  font-size: 1em;
`;

const ThemeSwitcherButton: React.FC = () => {
  const dispatch = useDispatch<ReduxDispatch>();
  const currentTheme = useSelector<ReduxState, ReduxSelectedTheme>(state => state.theme);
  const handler: React.MouseEventHandler<HTMLButtonElement> = () => {
    dispatch({
      type: 'theme',
      payload: currentTheme === 'standardDark' ? 'standardLight' : 'standardDark',
    });
  };

  return (
    <Button onClick={handler}>
      <Icon />
    </Button>
  );
};

export default ThemeSwitcherButton;
