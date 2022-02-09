declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: 'development' | string;
    GRAPHQL_ENDPOINT?: string;
    GRAPHQL_SUBSCRIPTION_ENDPOINT?: string;
    WEBPACK_DEV_SERVER_PORT?: string;
    SERVER_PORT?: string;
    SERVER_HOSTNAME?: string;
  }
}
