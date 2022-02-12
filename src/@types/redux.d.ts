declare type ThemeVariants = 'standardLight' | 'standardDark';
declare type LocaleVariants = 'ru-RU' | 'en-US';

declare type ReduxState = {
  readonly theme: ThemeVariants;
  readonly locale: LocaleVariants;
  readonly graphqlEndpoint: string;
  readonly graphqlSubscriptions: string;
};

declare type ReduxSetThemeAction = {
  readonly type: 'theme';
  readonly payload: ThemeVariants;
};

declare type ReduxSetLocaleAction = {
  readonly type: 'locale';
  readonly payload: LocaleVariants;
};

declare type ReduxSetGraphqlEndpointAction = {
  readonly type: 'graphqlEndpoint';
  readonly payload: string;
};

declare type ReduxSetGraphqlSubscriptionsAction = {
  readonly type: 'graphqlSubscriptions';
  readonly payload: string;
};

declare type ReduxActions =
  | ReduxSetThemeAction
  | ReduxSetLocaleAction
  | ReduxSetGraphqlEndpointAction
  | ReduxSetGraphqlSubscriptionsAction;

declare type ReduxSelectedTheme = ReduxState['theme'];
declare type ReduxSelectedLocale = ReduxState['locale'];
declare type ReduxSelectedUI = Pick<ReduxState, 'locale' | 'theme'>;
declare type ReduxSelectedGraphql = Pick<ReduxState, 'graphqlEndpoint' | 'graphqlSubscriptions'>;

declare type ReduxDispatch = import('redux').Dispatch<ReduxActions>;
