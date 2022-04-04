import { Dispatch } from 'redux';

export {};

declare global {
  export type ThemeName = 'standardLight' | 'standardDark';
  export type FontSize = 'small' | 'normal' | 'medium' | 'large';
  export type DeviceMode = 'desktop' | 'tablet' | 'mobile';
  export type LocaleName = 'ru-RU';

  export type ReduxStore = {
    readonly theme: ThemeName;
    readonly fontSize: FontSize;
    readonly locale: LocaleName;
    readonly deviceMode: DeviceMode;
  };

  export type ReduxActionSetTheme = {
    type: 'setTheme';
    payload: ThemeName;
  };

  export type ReduxActionSetFontSize = {
    type: 'setFontSize';
    payload: FontSize;
  };

  export type ReduxActionSetDeviceMode = {
    type: 'setDeviceMode';
    payload: DeviceMode;
  };

  export type ReduxActions =
    | ReduxActionSetTheme
    | ReduxActionSetFontSize
    | ReduxActionSetDeviceMode;

  export type ReduxDispatch = Dispatch<ReduxActions>;
}
