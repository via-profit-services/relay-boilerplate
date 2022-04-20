import * as React from 'react';
import { RelayEnvironmentProvider } from 'react-relay';

import useRelay from '~/relay/useRelay';

interface Props {
  readonly children: React.ReactNode | React.ReactNode[];
  readonly storeRecords?: Record<string, any>;
}

const RelayProvider: React.FC<Props> = props => {
  const { children, storeRecords } = props;
  const { relayEnvironment } = useRelay({
    storeRecords,
  });

  return (
    <RelayEnvironmentProvider environment={relayEnvironment}>{children}</RelayEnvironmentProvider>
  );
};

export default RelayProvider;
