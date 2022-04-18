/* eslint-disable no-console */
import * as React from 'react';
import { GraphQLError } from 'graphql';
import { FetchFunction, Observable } from 'relay-runtime';
import { createClient, NextMessage, Message } from 'graphql-ws';

type UseRelay = () => {
  relayFetch: FetchFunction;
  relaySubscribe: Subscribe;
  setToken: SetToken;
  setEndpoints: SetEndpoints;
};

type SetToken = (token: string | null) => void;
type SetEndpoints = (props: {
  readonly graphqlEndpoint: string;
  readonly graphqlSubscriptions: string;
}) => void;

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

const useRelay: UseRelay = () => {
  // const { graphqlEndpoint, graphqlSubscriptions, accessToken } = props;
  const tokenRef = React.useRef<string | null>(null);
  const endpointRef = React.useRef<string | null>(null);
  const subscriptionEndpointRef = React.useRef<string | null>(null);

  /**
   * Fetch function
   */
  const relayFetch = React.useCallback<FetchFunction>(
    async (operation, variables, _cacheConfig, uploadables) => {
      if (typeof endpointRef.current !== 'string') {
        throw new Error(`Graphql endpoint must be a string, but got ${typeof endpointRef.current}`);
      }

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

      if (!authOperations.includes(operation.name) && tokenRef.current) {
        request.headers = {
          ...request.headers,
          Authorization: `Bearer ${tokenRef.current}`,
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

      const body = await fetch(endpointRef.current, request)
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
        console.log('%c%s', `color:${color}`, 'Request ', endpointRef.current);
        console.groupCollapsed('%c%s', `color:${color}`, operation.operationKind);
        console.log(operation.text);
        console.groupEnd();

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
        if (!operation.text) {
          return sink.error(new Error('Operation text cannot be empty'));
        }

        if (typeof subscriptionEndpointRef.current !== 'string') {
          throw new Error(
            `Graphql endpoint must be a string, but got ${typeof subscriptionEndpointRef.current}`,
          );
        }

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

        const client = createClient({
          retryAttempts: 30,
          url: subscriptionEndpointRef.current,
          connectionParams: () =>
            tokenRef.current
              ? {
                  Authorization: `Bearer ${tokenRef.current}`,
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

        return client.subscribe(
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

              return sink.error(
                new Error((err as GraphQLError[]).map(({ message }) => message).join(', ')),
              );
            },
          },
        );
      }),
    [],
  );

  const setToken: SetToken = newToken => {
    tokenRef.current = newToken;
  };
  const setEndpoints: SetEndpoints = ({ graphqlEndpoint, graphqlSubscriptions }) => {
    endpointRef.current = graphqlEndpoint;
    subscriptionEndpointRef.current = graphqlSubscriptions;
  };

  return {
    relayFetch,
    relaySubscribe,
    setToken,
    setEndpoints,
  };
};

export default useRelay;
