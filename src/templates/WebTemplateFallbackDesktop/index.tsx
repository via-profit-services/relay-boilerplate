import * as React from 'react';
import styled from '@emotion/styled';
import { Global, css, useTheme } from '@emotion/react';
import { graphql, useFragment } from 'react-relay';
import { Helmet } from 'react-helmet';

import Header from '~/components/Header';
import RenderDraftjs from '~/components/RenderDraftjs';
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

const WebTemplateFallbackDesktop: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const theme = useTheme();
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
      <Global
        styles={css`
          body {
            margin: 0;
            background-color: ${theme.colors.defaultBackground};
            color: ${theme.colors.defaultText};
          }
        `}
      />
      <Container>
        <Header />
        <Content>
          <RenderDraftjs {...content} />
        </Content>
      </Container>
    </>
  );
};

export default WebTemplateFallbackDesktop;
