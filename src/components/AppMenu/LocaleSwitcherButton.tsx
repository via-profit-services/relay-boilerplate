import * as React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.defaultText};
  color: ${({ theme }) => theme.colors.defaultText};
  background: none;
  font-size: 1.2em;
  outline: none;
`;

const LocaleSwitcherButton: React.FC = () => {
  const dispatch = useDispatch<ReduxDispatch>();
  const currentLocale = useSelector<ReduxState, ReduxSelectedLocale>(state => state.locale);
  const handler: React.MouseEventHandler<HTMLButtonElement> = () => {
    dispatch({
      type: 'locale',
      payload: currentLocale === 'ru' ? 'en' : 'ru',
    });
  };

  const labelMap: Record<LocaleVariants, string> = {
    ru: 'RU',
    en: 'EN',
  };

  return <Button onClick={handler}>{labelMap[currentLocale]}</Button>;
};

export default LocaleSwitcherButton;
