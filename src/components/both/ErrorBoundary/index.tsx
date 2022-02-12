import * as React from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import styled, { createGlobalStyle } from 'styled-components';

const Container = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  border-radius: inherit;
  background-color: #8b0101;
  color: #f5e7e7;
`;

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
  }
`;

export interface ErrorBoundaryComponentProps {
  children: React.ReactNode | React.ReactNode[];
}

const ErrorBoundary: React.FC<ErrorBoundaryComponentProps> = props => {
  const { children } = props;

  return (
    <ReactErrorBoundary
      FallbackComponent={() => (
        <>
          <GlobalStyles />
          <Container>
            <h2>Something went wrong</h2>
            <p>Please try again later or contact your system administrator</p>
          </Container>
        </>
      )}
    >
      <>{children}</>
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
