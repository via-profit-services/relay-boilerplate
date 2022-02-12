import { Environment } from 'relay-runtime';

import store from '~/server/environment/store';
import networkFactory from '~/server/environment/network';

type EnvironmentFactory = (props: {
  graphqlEndpoint: string;
  graphqlSubscriptions: string;
}) => Environment;

const environmentFactory: EnvironmentFactory = props => {
  const environment = new Environment({
    network: networkFactory(props),
    store,
    isServer: true,
  });

  return environment;
};

export default environmentFactory;
