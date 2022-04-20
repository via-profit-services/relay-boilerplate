/* eslint-disable no-console */
import * as React from 'react';
import {
  FetchFunction,
  Observable,
  Environment,
  Network,
  Store,
  RecordSource,
} from 'relay-runtime';
import { createClient, NextMessage, Message } from 'graphql-ws';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

interface UseRelayProps {
  readonly storeRecords?: Record<string, any>;
}

type UseRelay = (props?: UseRelayProps) => {
  readonly relayEnvironment: Environment;
  readonly relayStore: Store;
};

type Subscribe = (
  operation: {
    cacheID: string;
    id: string | null;
    metadata: Record<string, any>;
    name: string;
    operationKind: 'subscription';
    text: string;
  },
  variables: Record<string, unknown>,
) => Observable<any>;

const selector = createSelector(
  (store: ReduxStore) => store.graphqlEndpoint,
  (store: ReduxStore) => store.graphqlSubscriptions,
  (store: ReduxStore) => store.accessToken?.token,
  (graphqlEndpoint, graphqlSubscriptions, accessToken) => ({
    graphqlEndpoint,
    graphqlSubscriptions,
    accessToken,
  }),
);

const useRelay: UseRelay = props => {
  const { accessToken, graphqlEndpoint, graphqlSubscriptions } = useSelector(selector);
  const { storeRecords } = props || {};
  const accessTokenRef = React.useRef(accessToken);
  const graphqlEndpointRef = React.useRef(graphqlEndpoint);
  const graphqlSubscriptionsRef = React.useRef(graphqlSubscriptions);

  React.useEffect(() => {
    accessTokenRef.current = accessToken;
  }, [accessToken]);

  React.useEffect(() => {
    graphqlEndpointRef.current = graphqlEndpoint;
  }, [graphqlEndpoint]);

  React.useEffect(() => {
    graphqlSubscriptionsRef.current = graphqlSubscriptions;
  }, [graphqlSubscriptions]);

  /**
   * Fetch function
   */
  const relayFetch = React.useCallback<FetchFunction>(
    async (operation, variables, _cacheConfig, uploadables) => {
      const authOperations = [
        'AuthorizationInnerVerifyTokenQuery',
        'AuthorizationInnerRefreshTokenMutation',
        'AuthentificationFormContentCreateTokenMutation',
      ];

      const request: RequestInit = {
        method: 'POST',
        headers: {
          'Accept-Encoding': 'br, gzip',
        },
      };

      if (!authOperations.includes(operation.name) && accessTokenRef.current) {
        request.headers = {
          ...request.headers,
          Authorization: `Bearer ${accessTokenRef.current}`,
        };
      }

      if (uploadables) {
        if (!window.FormData) {
          console.error('Uploading files without `FormData` not supported.');
        }

        const formData = new FormData();
        const map = {};

        let filesFieldName = 'variables.f';

        Object.keys(uploadables).forEach((_file, index) => {
          Object.entries(variables).forEach(([fieldName, fieldValue]) => {
            if (Array.isArray(fieldValue) && typeof fieldValue[index]?.name === 'string') {
              filesFieldName = `variables.${fieldName}`;
            }
          });

          map[index] = [`${filesFieldName}.${index}`];
        });

        formData.append(
          'operations',
          JSON.stringify({
            query: operation.text,
            documentId: operation.id,
            variables: {
              ...variables,
              files: Object.keys(uploadables).map(() => null),
            },
          }),
        );
        formData.append('map', JSON.stringify(map));

        Object.entries(uploadables).forEach(([_key, fileData], index) => {
          formData.append(String(index), fileData);
        });

        request.body = formData;
      } else {
        request.headers = {
          ...request.headers,
          'Content-Type': 'application/json',
        };

        request.body = JSON.stringify({
          documentId: operation.id,
          query: operation.text,
          variables,
        });
      }

      const body = await fetch(graphqlEndpointRef.current, request)
        .then(response => response.json())
        .catch(err => {
          console.error(err);

          return {
            data: null,
            errors: [
              {
                message: `GraphQL fetch error`,
              },
            ],
          };
        });

      if (process.env.NODE_ENV === 'development') {
        const color = body.data && !body.errors ? '#009627' : '#f44336';
        console.groupCollapsed(
          '%c%s',
          `color:${color};`,
          'GraphQL',
          `${operation.operationKind} ${operation.name}`,
        );
        console.log('%c%s', `color:${color}`, 'Request ', graphqlEndpointRef.current);
        if (operation.text) {
          console.groupCollapsed('%c%s', `color:${color}`, operation.operationKind);
          console.log(operation.text);
          console.groupEnd();
        }

        if (operation.id) {
          console.groupCollapsed('%c%s', `color:${color}`, `${operation.operationKind} ID`);
          console.log(operation.id);
          console.groupEnd();
        }

        // headers
        console.groupCollapsed('%c%s', `color:${color}`, 'Headers');
        console.table(request.headers);
        console.groupEnd();

        // variables
        console.groupCollapsed('%c%s', `color:${color}`, 'Variables');
        console.groupCollapsed('as Object');
        console.log(variables);
        console.groupEnd();
        console.groupCollapsed('as JSON string');
        console.log(JSON.stringify(variables));
        console.groupEnd();
        console.groupEnd();

        if (uploadables) {
          const filesArray = Object.values(uploadables);
          console.groupCollapsed('%c%s', `color:${color}`, `Files (${filesArray.length})`);
          console.table(filesArray);
          console.groupEnd();
        }
        if (body.data && !body.errors) {
          console.groupCollapsed('%c%s', `color:${color}`, 'Response');
          console.log(body.data);
          console.groupEnd();
        }

        if (body.errors) {
          console.groupCollapsed('%c%s', `color:${color}`, 'Errors');
          if (Array.isArray(body.errors)) {
            body.errors.forEach(error => {
              console.log('%c%s', `color:${color}`, error.message);
              console.groupCollapsed('%c%s', `color:${color}`, 'Details');
              console.log(error);
              console.groupEnd();
            });
          }
          console.log();
          console.groupEnd();
        }
        console.groupEnd();
      }

      return body;
    },
    [],
  );

  const subscriptionClient = React.useMemo(() => {
    if (!graphqlSubscriptionsRef.current) {
      throw new Error(
        `Graphql subscription endpoint must be provied, but got «${graphqlSubscriptionsRef.current}»`,
      );
    }

    return createClient({
      retryAttempts: 30,
      url: graphqlSubscriptionsRef.current,
      connectionParams: () =>
        accessTokenRef.current
          ? {
              Authorization: `Bearer ${accessTokenRef.current}`,
            }
          : {},
      on:
        process.env.NODE_ENV === 'development'
          ? {
              connected: () => console.log('%c%s', 'color:#009627', 'WebSocket connected'),
              closed: () => console.log('%c%s', 'color:#ff4e4e', 'WebSocket closed'),
              error: err => console.log('%c%s', 'color:#ff4e4e', 'WebSocket error', err),
              message: message => {
                if (typeof message === 'undefined') {
                  return;
                }
                const isNextMessage = (m: Message): m is NextMessage => m.type === 'next';

                if (isNextMessage(message)) {
                  const { data } = message.payload;
                  if (typeof data === 'object') {
                    Object.entries(data as any).forEach(([trigger, payload]) => {
                      console.groupCollapsed(
                        '%c%s%c%s',
                        'color:#009627;',
                        '• ',
                        'color:#009627;',
                        `WebSocket message «${trigger}»`,
                      );
                      console.log(payload);
                      console.groupEnd();
                    });
                  }
                }
              },
            }
          : undefined,
    });
  }, []);

  /**
   * Subscribe observer
   */
  const relaySubscribe = React.useCallback<Subscribe>(
    (operation, variables) =>
      Observable.create(sink => {
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(
            '%c%s%c%s',
            'color:#009627;',
            '• ',
            'color:#bb7bff;',
            'GraphQL Subscription',
            operation.name,
          );
        }

        return subscriptionClient.subscribe(
          {
            operationName: operation.name,
            query: operation.id || operation.text,
            variables,
            extensions: operation.id
              ? {
                  persistedQuery: operation.id,
                }
              : null,
          },
          {
            ...sink,
            error: err => {
              if (err instanceof Error) {
                return sink.error(err);
              }

              if (err instanceof CloseEvent) {
                return sink.error(
                  // reason will be available on clean closes
                  new Error(
                    `WebSocket with Subscription «${operation.name}» closed with event ${
                      err.code
                    } with reason ${err.reason || ''}`,
                  ),
                );
              }

              return sink.error(err as Error);

              // return sink.error(
              //   new Error((err as GraphQLError[]).map(({ message }) => message).join(', ')),
              // );
            },
          },
        );
      }),
    [subscriptionClient],
  );

  /**
   * Store
   */
  const relayStore = React.useMemo(() => {
    console.debug('[Relay] Store init');

    return new Store(new RecordSource(storeRecords), {
      queryCacheExpirationTime: 5 * 60 * 1000,
    });
  }, [storeRecords]);

  /**
   * Network
   */
  const relayNetwork = React.useMemo(() => {
    console.debug('[Relay] Network init');

    return Network.create(relayFetch, relaySubscribe);
  }, [relayFetch, relaySubscribe]);

  /**
   * Environment
   */
  const relayEnvironment = React.useMemo(() => {
    console.debug('[Relay] Environment init');

    return new Environment({
      isServer: typeof window === 'undefined',
      store: relayStore,
      network: relayNetwork,
    });
  }, [relayStore, relayNetwork]);

  return {
    relayEnvironment,
    relayStore,
  };
};

export default useRelay;
