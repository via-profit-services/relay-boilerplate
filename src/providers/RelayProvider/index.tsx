import * as React from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import { useSelector } from 'react-redux';
import environmentFactory from '~/environment';

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

const RelayProvider: React.FC<Props> = props => {
  const { children } = props;
  const { graphqlEndpoint, graphqlSubscriptions } = useSelector<ReduxState, ReduxSelectedGraphql>(
    state => ({
      graphqlEndpoint: state.graphqlEndpoint,
      graphqlSubscriptions: state.graphqlSubscriptions,
    }),
  );
  const environment = React.useMemo(
    () =>
      environmentFactory({
        graphqlEndpoint,
        graphqlSubscriptions,
      }),
    [graphqlEndpoint, graphqlSubscriptions],
  );

  return <RelayEnvironmentProvider environment={environment}>{children}</RelayEnvironmentProvider>;
};

export default RelayProvider;
