import * as React from 'react';
import styled from '@emotion/styled';
import { Global, css, useTheme } from '@emotion/react';
import { graphql, useFragment } from 'react-relay';
import { Helmet } from 'react-helmet';

import Header from '~/components/Header';
import PageTitle from '~/components/PageTitle';
import RenderDraftjs from '~/components/RenderDraftjs';
import fragment, {
  WebTemplateSecondDesktopFragment$key,
} from '~/relay/artifacts/WebTemplateSecondDesktopFragment.graphql';

type Props = {
  fragmentRef: WebTemplateSecondDesktopFragment$key;
};

graphql`
  fragment WebTemplateSecondDesktopFragment on WebTemplateSecond {
    __typename
    menuFragment: mainMenu {
      ...HeaderMenuFragment
    }
    h1
    content
    page {
      id
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

const WebTemplateSecondDesktop: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const theme = useTheme();
  const { content, h1, page, menuFragment } = useFragment<WebTemplateSecondDesktopFragment$key>(
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
        <Header fragmentRef={menuFragment} />
        <Content>
          <PageTitle>{h1}</PageTitle>
          <RenderDraftjs {...content} />
        </Content>
      </Container>
    </>
  );
};

export default WebTemplateSecondDesktop;
