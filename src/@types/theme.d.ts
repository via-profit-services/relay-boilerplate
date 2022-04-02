import '@emotion/react';

declare module '@emotion/react' {
  export interface Theme {
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
