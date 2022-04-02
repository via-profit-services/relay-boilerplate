import { Theme } from '@emotion/react';

const standardLight: Theme = {
  fontSize: {
    small: 14,
    normal: 16,
    medium: 18,
    large: 20,
  },
  zIndex: {
    header: 8,
    mainDrawer: 9,
    modal: 10,
  },
  grid: {
    frameGutter: 30,
  },
  colors: {
    defaultBackground: '#f1f1f1',
    defaultText: '#212121',
  },
};

export default standardLight;
