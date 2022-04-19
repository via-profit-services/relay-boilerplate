import * as React from 'react';
import styled from '@emotion/styled';
import { Global, css, useTheme } from '@emotion/react';
import { graphql, useFragment } from 'react-relay';
import { Helmet } from 'react-helmet';

import Header from '~/components/Header';
import MainSliderBlock from '~/components/MainSliderBlock';
import PageTitle from '~/components/PageTitle';
import RenderDraftjs from '~/components/RenderDraftjs';
import fragment, {
  WebTemplateHomeDesktopFragment$key,
} from '~/relay/artifacts/WebTemplateHomeDesktopFragment.graphql';

type Props = {
  fragmentRef: WebTemplateHomeDesktopFragment$key;
};

graphql`
  fragment WebTemplateHomeDesktopFragment on WebTemplateHome {
    __typename
    menuFragment: mainMenu {
      ...HeaderMenuFragment
    }
    id
    h1
    content
    slider {
      slides {
        id
        image
      }
    }
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

const WebTemplateHomeDesktop: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const theme = useTheme();
  const { h1, content, page, slider, menuFragment } =
    useFragment<WebTemplateHomeDesktopFragment$key>(fragment, fragmentRef);

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
          {slider && <MainSliderBlock {...slider} />}
          {content && <RenderDraftjs {...content} />}
        </Content>
      </Container>
    </>
  );
};

export default WebTemplateHomeDesktop;
