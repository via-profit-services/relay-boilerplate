declare type ThemeName = 'standardLight' | 'standardDark';
declare type FontSize = 'small' | 'normal' | 'medium' | 'large';
declare type DeviceMode = 'desktop' | 'tablet' | 'mobile';
declare type LocaleName = 'ru-RU';
declare interface ReduxStore {
  readonly theme: ThemeName;
  readonly fontSize: FontSize;
  readonly locale: LocaleName;
  readonly deviceMode: DeviceMode;
  readonly graphqlEndpoint: string | null;
  readonly graphqlSubscriptions: string | null;
}

declare interface ReduxActionSetTheme {
  type: 'setTheme';
  payload: ThemeName;
}

declare interface ReduxActionSetFontSize {
  type: 'setFontSize';
  payload: FontSize;
}

declare interface ReduxActionSetDeviceMode {
  type: 'setDeviceMode';
  payload: DeviceMode;
}

declare type ReduxActions = ReduxActionSetTheme | ReduxActionSetFontSize | ReduxActionSetDeviceMode;

declare type ReduxDispatch = import('redux').Dispatch<ReduxActions>;
