import * as React from 'react';
import styled from '@emotion/styled';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Btn = styled.button<{ $active?: boolean }>`
  font-size: 0.8rem;
  background: ${props => (props.$active ? 'orange' : 'white')};
`;

const selector = createSelector(
  (store: ReduxStore) => store.fontSize,
  (store: ReduxStore) => store.theme,
  (fontSize, theme) => ({ fontSize, theme }),
);

const HeaderToolbar: React.FC = () => {
  const { theme, fontSize } = useSelector(selector);
  const dispatch = useDispatch<ReduxDispatch>();

  const setFontSize = (fontSizeValue: FontSize) => () => {
    Cookies.set('fontSize', fontSizeValue);
    dispatch({
      type: 'setFontSize',
      payload: fontSizeValue,
    });
  };

  const switchTheme = () => {
    const themeValue = theme === 'standardLight' ? 'standardDark' : 'standardLight';
    Cookies.set('theme', themeValue);
    dispatch({
      type: 'setTheme',
      payload: themeValue,
    });
  };

  return (
    <Container>
      <Btn $active={fontSize === 'small'} onClick={setFontSize('small')}>
        small
      </Btn>
      <Btn $active={fontSize === 'normal'} onClick={setFontSize('normal')}>
        normal
      </Btn>
      <Btn $active={fontSize === 'medium'} onClick={setFontSize('medium')}>
        medium
      </Btn>
      <Btn onClick={() => switchTheme()}>Theme: {theme}</Btn>
    </Container>
  );
};

export default HeaderToolbar;
