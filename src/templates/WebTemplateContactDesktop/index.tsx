import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import { Helmet } from 'react-helmet';

import WebAppMenu from '~/components/both/WebAppMenu';
import H1 from '~/components/both/Typography/H1';
import Paragraph from '~/components/both/Typography/Paragraph';
import fragment, {
  WebTemplateContactDesktopFragment$key,
} from '~/relay/artifacts/WebTemplateContactDesktopFragment.graphql';

type Props = {
  fragmentRef: WebTemplateContactDesktopFragment$key;
};

graphql`
  fragment WebTemplateContactDesktopFragment on WebTemplateContact {
    __typename
    h1
    address
    page {
      meta {
        locale
        title
        description
      }
    }
  }
`;

const Container = styled.div`
  display: flex;
  flex-flow: column;
  min-height: 100vh;
`;

const Content = styled.div`
  padding: 20px;
  flex: 1;
`;

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    background-color: ${({ theme }) => theme.colors.defaultBackground};
    color: ${({ theme }) => theme.colors.defaultText};
  }
`;

const WebTemplateContactDesktop: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const { h1, address, page } = useFragment<WebTemplateContactDesktopFragment$key>(
    fragment,
    fragmentRef,
  );

  return (
    <>
      <Helmet htmlAttributes={{ lang: page.meta.locale }}>
        <title>{page.meta.title}</title>
        <meta name="description" content={page.meta.description} />
      </Helmet>
      <GlobalStyles />
      <Container>
        <WebAppMenu />
        <Content>
          <H1>{h1}</H1>
          <Paragraph>{address}</Paragraph>
        </Content>
      </Container>
    </>
  );
};

export default WebTemplateContactDesktop;
