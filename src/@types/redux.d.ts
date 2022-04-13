import { Dispatch } from 'redux';

export {};

declare global {
  export type ThemeName = 'standardLight' | 'standardDark';
  export type FontSize = 'small' | 'normal' | 'medium' | 'large';
  export type DeviceMode = 'desktop' | 'tablet' | 'mobile';
  export type LocaleName = 'ru-RU';

  export type AccountRole =
    | 'DEVELOPER'
    | 'ADMINISTRATOR'
    | 'VIEWER'
    | 'OPTIMIZATOR'
    | 'COPYWRITER'
    | '%future added value';
  export type TokenType = 'ACCESS' | 'REFRESH' | '%future added value';
  export interface AccessToken {
    readonly token: string;
    readonly payload: {
      readonly id: string;
      readonly uuid: string;
      readonly exp: number;
      readonly iss: string | null;
      readonly roles: ReadonlyArray<AccountRole>;
      readonly type: TokenType;
    };
  }

  export interface RefreshToken {
    readonly token: string;
    readonly payload: {
      readonly id: string;
      readonly uuid: string;
      readonly exp: number;
      readonly iss: string | null;
      readonly type: TokenType;
    };
  }

  export type ReduxStore = {
    readonly theme: ThemeName;
    readonly fontSize: FontSize;
    readonly locale: LocaleName;
    readonly deviceMode: DeviceMode;
    readonly graphqlEndpoint: string;
    readonly graphqlSubscriptions: string;
    readonly accessToken: AccessToken | null;
    readonly refreshToken: RefreshToken | null;
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


  export type ReduxSetTokensAction = {
    readonly type: 'setTokens';
    readonly payload: {
      accessToken: AccessToken;
      refreshToken: RefreshToken;
    };
  };

  export type ReduxResetTokensAction = {
    readonly type: 'resetTokens';
  };


  export type ReduxActions =
    | ReduxActionSetTheme
    | ReduxActionSetFontSize
    | ReduxActionSetDeviceMode
    | ReduxSetTokensAction
    | ReduxResetTokensAction;

  export type ReduxDispatch = Dispatch<ReduxActions>;
}
