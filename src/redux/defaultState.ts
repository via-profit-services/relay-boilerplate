const defaultState: ReduxStore = {
  theme: 'standardLight',
  fontSize: 'normal',
  locale: 'ru-RU',
  deviceMode: 'desktop',
  accessToken: null,
  refreshToken: null,
  graphqlEndpoint: 'http://localhost/graphql',
  graphqlSubscriptions: 'ws://localhost/subscriptions',
};

export default defaultState;
