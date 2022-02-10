import { DefaultTheme } from 'styled-components';

import standardLight from './standardLight';

const standardDark: DefaultTheme = {
  ...standardLight,
  colors: {
    ...standardLight.colors,
    defaultBackground: '#211536',
    defaultText: '#ebebeb',
  },
};

export default standardDark;
