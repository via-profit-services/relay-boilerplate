import { Dispatch } from 'redux';

export {};

declare global {
  export type ThemeVariants = 'standardLight' | 'standardDark';
  export type LocaleVariants = 'ru';

  export type ReduxState = {
    theme: ThemeVariants;
    locale: LocaleVariants;
  };

  export type ReduxSetThemeAction = {
    readonly type: 'theme';
    readonly payload: ThemeVariants;
  };

  export type ReduxSetLocaleAction = {
    readonly type: 'locale';
    readonly payload: LocaleVariants;
  };

  export type ReduxActions = ReduxSetThemeAction | ReduxSetLocaleAction;

  export type ReduxSelectedTheme = ReduxState['theme'];
  export type ReduxSelectedLocale = ReduxState['locale'];
  export type ReduxSelectedUI = Pick<ReduxState, 'locale' | 'theme'>;

  export type ReduxDispatch = Dispatch<ReduxActions>;
}
