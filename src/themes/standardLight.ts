import { DefaultTheme } from 'styled-components';

const standardLight: DefaultTheme = {
  fontSize: 16,
  zIndex: {
    appBar: 8,
    mobileMenu: 9,
    modal: 10,
    terms: 20,
  },
  colors: {
    defaultBackground: '#f1f1f1',
    defaultText: '#212121',
  },
};

export default standardLight;
