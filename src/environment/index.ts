import { Environment } from 'relay-runtime';

import store from '~/environment/store';
import networkFactory from '~/environment/network';

type EnvironmentFactory = (props: {
  graphqlEndpoint: string;
  graphqlSubscriptions: string;
}) => Environment;

const environmentFactory: EnvironmentFactory = props => {
  const environment = new Environment({
    network: networkFactory(props),
    store,
    isServer: typeof window === 'undefined',
  });

  return environment;
};

export default environmentFactory;
