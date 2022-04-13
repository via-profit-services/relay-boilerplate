import * as React from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { Environment, Network, Store, RecordSource } from 'relay-runtime';

import useRelay from '~/relay/useRelay';

interface Props {
  readonly children: React.ReactNode | React.ReactNode[];
  readonly storeRecords?: Record<string, any>;
}

const selector = createSelector(
  (store: ReduxStore) => store.accessToken?.token || '',
  (store: ReduxStore) => store.graphqlEndpoint,
  (store: ReduxStore) => store.graphqlSubscriptions,
  (accessToken, graphqlEndpoint, graphqlSubscriptions) => ({
    accessToken,
    graphqlEndpoint,
    graphqlSubscriptions,
  }),
);

const RelayProvider: React.FC<Props> = props => {
  const { children, storeRecords } = props;
  const { graphqlEndpoint, graphqlSubscriptions, accessToken } = useSelector(selector);
  const { relayFetch, relaySubscribe, setEndpoints, setToken } = useRelay();

  React.useEffect(() => {
    setEndpoints({ graphqlEndpoint, graphqlSubscriptions });
  }, [graphqlEndpoint, graphqlSubscriptions, setEndpoints]);

  React.useEffect(() => {
    setToken(accessToken);
  }, [accessToken, setToken]);

  const network = React.useMemo(() => {
    console.debug('[Relay] Network init');

    return Network.create(relayFetch, relaySubscribe);
  }, [relayFetch, relaySubscribe]);

  const store = React.useMemo(() => {
    console.debug('[Relay] Store init');

    return new Store(new RecordSource(storeRecords), {
      queryCacheExpirationTime: 5 * 60 * 1000,
    });
  }, [storeRecords]);

  const environment = React.useMemo(() => {
    console.debug('[Relay] Environment init');

    return new Environment({
      isServer: typeof window === 'undefined',
      store,
      network,
    });
  }, [network, store]);

  return <RelayEnvironmentProvider environment={environment}>{children}</RelayEnvironmentProvider>;
};

export default RelayProvider;
