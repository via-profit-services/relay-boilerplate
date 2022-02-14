import * as React from 'react';
import styled from 'styled-components';
import SunIcon from 'mdi-react/SunMoonStarsIcon';
import { useDispatch, useSelector } from 'react-redux';

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: none;
  outline: none;
  border: 1px solid #fff;
  width: 3em;
  height: 3em;
  border-radius: 100%;
  padding: 0.4em;
  font-size: 0.5em;
  cursor: pointer;
`;

const Icon = styled(SunIcon)`
  color: #fff;
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
