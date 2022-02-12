/* eslint-disable no-console */
import { Observable } from 'relay-runtime';
import { createClient, Client, NextMessage, Message } from 'graphql-ws';
import { GraphQLError } from 'graphql';

import persistedQueries from '~/relay/persisted-queries.json';

type SubscriptionClientFactory = (subscriptionsEndpoint: string) => Client;
type SubscriptionFactory = (subscriptionsEndpoint: string) => Subscribe;
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

const subscriptionClient: SubscriptionClientFactory = subscriptionsEndpoint =>
  createClient({
    retryAttempts: 30,
    url: subscriptionsEndpoint,
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

const subscribe: SubscriptionFactory = subscriptionEndpoint => (operation, variables) =>
  Observable.create(sink => {
    if (!operation.text) {
      return sink.error(new Error('Operation text cannot be empty'));
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

    return subscriptionClient(subscriptionEndpoint).subscribe(
      {
        query: operation.id && !operation.text ? persistedQueries[operation.id] : operation.text,
        operationName: operation.name,
        variables,
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
  });

export default subscribe;
