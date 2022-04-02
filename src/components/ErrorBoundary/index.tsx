import * as React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';

import Fallback from './Fallback';

export interface ErrorBoundaryComponentProps {
  children: React.ReactNode | React.ReactNode[];
}

const ErrorBoundary: React.FC<ErrorBoundaryComponentProps> = props => {
  const { children } = props;

  return (
    <ReactErrorBoundary FallbackComponent={Fallback}>
      <>{children}</>
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
