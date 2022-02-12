import * as React from 'react';
import { useSelector } from 'react-redux';
import { DefaultTheme, ThemeProvider } from 'styled-components';

import themeStandardLight from '~/themes/standardLight';
import themeStandardDark from '~/themes/standardDark';

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

const themesMap: Record<ReduxState['theme'], DefaultTheme> = {
  standardLight: themeStandardLight,
  standardDark: themeStandardDark,
};

const UIProvider: React.FC<Props> = props => {
  const { children } = props;
  const themeName = useSelector<ReduxState, ReduxSelectedTheme>(store => store.theme);

  const theme = React.useMemo(() => themesMap[themeName] || themesMap.standardLight, [themeName]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default UIProvider;
