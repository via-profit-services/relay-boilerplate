import { Theme } from '@emotion/react';

import standardLight from './standardLight';

const standardDark: Theme = {
  ...standardLight,
  colors: {
    ...standardLight.colors,
    defaultBackground: '#211536',
    defaultText: '#ebebeb',
  },
};

export default standardDark;
