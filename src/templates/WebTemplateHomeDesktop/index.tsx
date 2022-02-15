import * as React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { graphql, useFragment } from 'react-relay';
import { Helmet } from 'react-helmet';

import AppMenu from '~/components/both/AppMenu';
import Slider from '~/components/desktop/Slider';
import H1 from '~/components/both/Typography/H1';
import RenderDraftjs from '~/components/both/RenderDraftjs';
import fragment, {
  WebTemplateHomeDesktopFragment$key,
} from '~/relay/artifacts/WebTemplateHomeDesktopFragment.graphql';

type Props = {
  fragmentRef: WebTemplateHomeDesktopFragment$key;
};

graphql`
  fragment WebTemplateHomeDesktopFragment on WebTemplateHome {
    __typename
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

const WebTemplateHomeDesktop: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const { h1, content, page, slider } = useFragment<WebTemplateHomeDesktopFragment$key>(
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
        <AppMenu />
        <Content>
          <H1>{h1}</H1>
          <Slider slides={slider.slides} />
          <RenderDraftjs {...content} />
        </Content>
      </Container>
    </>
  );
};

export default WebTemplateHomeDesktop;
