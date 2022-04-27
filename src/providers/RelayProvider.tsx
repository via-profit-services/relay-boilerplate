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
import { createClient, NextMessage, Message, Client } from 'graphql-ws';
import { RelayEnvironmentProvider } from 'react-relay';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';

interface Props {
  readonly children: React.ReactNode | React.ReactNode[];
  readonly storeRecords?: Record<string, any>;
}

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
  (graphqlEndpoint, graphqlSubscriptions) => ({
    graphqlEndpoint,
    graphqlSubscriptions,
  }),
);

const RelayProvider: React.FC<Props> = props => {
  const { children, storeRecords } = props;
  const { graphqlEndpoint, graphqlSubscriptions } = useSelector(selector);

  const accessTokenRef = React.useRef<string | null>(null);
  const graphqlEndpointRef = React.useRef(graphqlEndpoint);
  const subscriptionClientRef = React.useRef<Client | null>(null);
  const graphqlSubscriptionsRef = React.useRef(graphqlSubscriptions);

  if (graphqlEndpointRef.current !== graphqlEndpoint) {
    graphqlEndpointRef.current = graphqlEndpoint;
  }

  if (graphqlSubscriptionsRef.current !== graphqlSubscriptions) {
    graphqlSubscriptionsRef.current = graphqlSubscriptions;
    if (subscriptionClientRef.current) {
      subscriptionClientRef.current.dispose();
    }
  }

  if (!subscriptionClientRef.current && typeof window !== 'undefined') {
    console.debug('[Relay] Subscription client init');
    subscriptionClientRef.current = createClient({
      retryAttempts: 30,
      url: graphqlSubscriptionsRef.current || 'unknown',
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
  }

  const relayFetch = React.useCallback<FetchFunction>(
    async (operation, variables, _cacheConfig, uploadables) => {
      const authOperations: string[] = [];

      const request: RequestInit = {
        method: 'POST',
        headers: {
          'Accept-Encoding': 'gzip',
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

      const body = await fetch(graphqlEndpointRef.current || 'unknown', request)
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

  /**
   * Subscribe observer
   */
  const relaySubscribe = React.useCallback<Subscribe>(
    (operation, variables) =>
      Observable.create(sink => {
        const { id, name, text } = operation;

        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log(
            '%c%s%c%s',
            'color:#009627;',
            '• ',
            'color:#bb7bff;',
            'GraphQL Subscription',
            name,
          );
        }

        return subscriptionClientRef.current?.subscribe(
          {
            operationName: name,
            query: text || '',
            variables,
            // persisted query support
            extensions: id
              ? {
                  documentId: id,
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
    [],
  );

  /**
   * Store
   */
  const relayStore = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      console.debug('[Relay] Store init');
    }

    return new Store(new RecordSource(storeRecords), {
      queryCacheExpirationTime: 5 * 60 * 1000,
    });
  }, [storeRecords]);

  /**
   * Network
   */
  const relayNetwork = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      console.debug('[Relay] Network init');
    }

    return Network.create(relayFetch, relaySubscribe);
  }, [relayFetch, relaySubscribe]);

  /**
   * Environment
   */
  const relayEnvironment = React.useMemo(() => {
    if (typeof window !== 'undefined') {
      console.debug('[Relay] Environment init');
    }

    return new Environment({
      isServer: typeof window === 'undefined',
      store: relayStore,
      network: relayNetwork,
    });
  }, [relayStore, relayNetwork]);

  return (
    <RelayEnvironmentProvider environment={relayEnvironment}>{children}</RelayEnvironmentProvider>
  );
};

export default RelayProvider;
