declare type ThemeVariants = 'standardLight' | 'standardDark';
declare type LocaleVariants = 'ru-RU';

declare type ReduxState = {
  readonly theme: ThemeVariants;
  readonly locale: LocaleVariants;
};

declare type ReduxSetThemeAction = {
  readonly type: 'theme';
  readonly payload: ThemeVariants;
};

declare type ReduxSetLoaleAction = {
  readonly type: 'locale';
  readonly payload: LocaleVariants;
};

declare type ReduxActions = ReduxSetThemeAction | ReduxSetLoaleAction;

declare type ReduxSelectedTheme = ReduxState['theme'];
declare type ReduxSelectedLocale = ReduxState['locale'];

declare type ReduxDispatch = import('redux').Dispatch<ReduxActions>;
