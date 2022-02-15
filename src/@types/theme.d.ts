import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    fontSize: number;
    zIndex: {
      appBar: number;
      mobileMenu: number;
      modal: number;
      terms: number;
    };
    colors: {
      defaultBackground: string;
      defaultText: string;
    };
    grid: {
      desktop: {
        safeFrame: number;
        gutter: number;
      };
    };
  }
}
