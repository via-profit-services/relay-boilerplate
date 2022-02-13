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

const ErrorBoundary: React.FC = () => (
  <>
    <GlobalStyles />
    <Container>
      <h1>It looks like our server has broken down</h1>
      <p>We&apos;re already fixing it. We are waiting for you later</p>
    </Container>
  </>
);

export default ErrorBoundary;
