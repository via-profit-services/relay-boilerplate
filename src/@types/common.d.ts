declare module 'common' {
  export interface AppConfigProduction {
    graphql: {
      endpoint: string;
      subscriptions: string;
    };
    server: {
      hostname: string;
      port: number;
    };
  }

  export interface ServerToClientTransfer {
    REDUX: Record<string, any>;
    ENVIRONMENT: {
      GRAPHQL_ENDPOINT: string;
      SUBSCRIPTION_ENDPOINT: string;
    };
  }
}
