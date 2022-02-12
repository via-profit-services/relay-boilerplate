import { Network } from 'relay-runtime';

import fetchFunction from '~/environment/fetchFunction';
import subscriptionFunction from '~/environment/subscriptionFunction';

type NetworkFactory = (props: { graphqlEndpoint: string; graphqlSubscriptions: string }) => any;

const networkFactory: NetworkFactory = props => {
  const { graphqlEndpoint, graphqlSubscriptions } = props;

  return Network.create(fetchFunction(graphqlEndpoint), subscriptionFunction(graphqlSubscriptions));
};
export default networkFactory;
