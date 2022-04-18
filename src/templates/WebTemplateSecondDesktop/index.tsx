import * as React from 'react';
import styled from '@emotion/styled';
import { Global, css, useTheme } from '@emotion/react';
import { graphql, useFragment } from 'react-relay';
import { Helmet } from 'react-helmet';

import Header from '~/components/Header';
import H1 from '~/components/Typography/H1';
import RenderDraftjs from '~/components/RenderDraftjs';
import fragment, {
  WebTemplateSecondDesktopFragment$key,
} from '~/relay/artifacts/WebTemplateSecondDesktopFragment.graphql';
import menuFragment, {
  WebPageMainMenuFragment$key,
} from '~/relay/artifacts/WebPageMainMenuFragment.graphql';

type Props = {
  fragmentRef: WebTemplateSecondDesktopFragment$key;
};

graphql`
  fragment WebTemplateSecondDesktopFragment on WebTemplateSecond {
    __typename
    h1
    content
    mainMenu {
      ...WebPageMainMenuFragment
    }
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

const WebTemplateSecondDesktop: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const theme = useTheme();
  const { content, h1, page, mainMenu } = useFragment<WebTemplateSecondDesktopFragment$key>(
    fragment,
    fragmentRef,
  );
  const menu = useFragment<WebPageMainMenuFragment$key>(menuFragment, mainMenu);

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
        {menu && <Header menu={menu} />}
        <Content>
          <H1>{h1}</H1>
          <RenderDraftjs {...content} />
        </Content>
      </Container>
    </>
  );
};

export default WebTemplateSecondDesktop;
