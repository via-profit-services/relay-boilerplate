import * as React from 'react';
import styled from '@emotion/styled';
import { Global, css, useTheme } from '@emotion/react';
import { graphql, useFragment } from 'react-relay';
import { Helmet } from 'react-helmet';

import Header from '~/components/Header';
import PageTitle from '~/components/PageTitle';
import Paragraph from '~/components/Typography/Paragraph';
import fragment, {
  WebTemplateContactDesktopFragment$key,
} from '~/relay/artifacts/WebTemplateContactDesktopFragment.graphql';

type Props = {
  fragmentRef: WebTemplateContactDesktopFragment$key;
};

graphql`
  fragment WebTemplateContactDesktopFragment on WebTemplateContact {
    __typename
    menuFragment: mainMenu {
      ...HeaderMenuFragment
    }
    h1
    address
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

const WebTemplateContactDesktop: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const theme = useTheme();
  const { h1, address, page, menuFragment } = useFragment<WebTemplateContactDesktopFragment$key>(
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
          <Paragraph>{address}</Paragraph>
        </Content>
      </Container>
    </>
  );
};

export default WebTemplateContactDesktop;
