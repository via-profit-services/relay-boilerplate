import { Dispatch } from 'redux';

export {};

declare global {
  export type ThemeName = 'standardLight' | 'standardDark';
  export type FontSize = 'small' | 'normal' | 'medium' | 'large';
  export type LocaleName = 'ru-RU';

  export type ReduxStore = {
    readonly ui: {
      readonly theme: ThemeName;
      readonly fontSize: FontSize;
      readonly locale: LocaleName;
    };
  };

  export type ReduxActionSetUI = {
    readonly type: 'setUI';
    readonly payload: Partial<ReduxStore['ui']>;
  };

  export type ReduxActions = ReduxActionSetUI;

  export type ReduxDispatch = Dispatch<ReduxActions>;
}
