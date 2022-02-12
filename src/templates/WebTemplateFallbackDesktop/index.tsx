import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import { Helmet } from 'react-helmet';

import WebAppMenu from '~/components/WebAppMenu';
import RenderDraftjs from '~/components/both/RenderDraftjs';
import fragment, {
  WebTemplateFallbackDesktopFragment$key,
} from '~/relay/artifacts/WebTemplateFallbackDesktopFragment.graphql';

type Props = {
  fragmentRef: WebTemplateFallbackDesktopFragment$key;
};

graphql`
  fragment WebTemplateFallbackDesktopFragment on WebTemplateFallback {
    __typename
    id
    content
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

const WebTemplateFallbackDesktop: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const { content, page } = useFragment<WebTemplateFallbackDesktopFragment$key>(
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
          <RenderDraftjs {...content} />
        </Content>
      </Container>
    </>
  );
};

export default WebTemplateFallbackDesktop;
