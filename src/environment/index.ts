import { Network, Store, RecordSource, Environment } from 'relay-runtime';

import fetchFunction from '~/environment/fetchFunction';
import subscriptionFunction from '~/environment/subscriptionFunction';

type EnvironmentFactory = (props: {
  graphqlEndpoint: string;
  subscriptionsEndpoint: string;
}) => Environment;

const environmentFactory: EnvironmentFactory = props => {
  const { graphqlEndpoint, subscriptionsEndpoint } = props;
  const relayNetwork = Network.create(
    fetchFunction(graphqlEndpoint),
    subscriptionFunction(subscriptionsEndpoint),
  );
  const relaySrore = new Store(new RecordSource());
  const environment = new Environment({
    network: relayNetwork,
    store: relaySrore,
    isServer: false,
  });

  return environment;
};

export default environmentFactory;
