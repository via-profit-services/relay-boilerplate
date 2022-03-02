import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    fontSize: Record<'small' | 'normal' | 'medium' | 'large', number>;
    zIndex: {
      header: number;
      mainDrawer: number;
      modal: number;
    };
    grid: {
      frameGutter: number;
    };
    colors: {
      defaultBackground: string;
      defaultText: string;
    };
  }
}
