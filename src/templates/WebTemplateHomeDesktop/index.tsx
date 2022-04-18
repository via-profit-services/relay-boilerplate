import * as React from 'react';
import styled from '@emotion/styled';
import { Global, css, useTheme } from '@emotion/react';
import { graphql, useFragment } from 'react-relay';
import { Helmet } from 'react-helmet';

import Header from '~/components/Header';
import MainSliderBlock from '~/components/MainSliderBlock';
import H1 from '~/components/Typography/H1';
import RenderDraftjs from '~/components/RenderDraftjs';
import fragment, {
  WebTemplateHomeDesktopFragment$key,
} from '~/relay/artifacts/WebTemplateHomeDesktopFragment.graphql';
import menuFragment, {
  WebPageMainMenuFragment$key,
} from '~/relay/artifacts/WebPageMainMenuFragment.graphql';

type Props = {
  fragmentRef: WebTemplateHomeDesktopFragment$key;
};

graphql`
  fragment WebTemplateHomeDesktopFragment on WebTemplateHome {
    __typename
    id
    h1
    content
    mainMenu {
      ...WebPageMainMenuFragment
    }
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

const WebTemplateHomeDesktop: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const theme = useTheme();
  const { h1, content, page, slider, mainMenu } = useFragment<WebTemplateHomeDesktopFragment$key>(
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
          {h1 && <H1>{h1}</H1>}
          {slider && <MainSliderBlock {...slider} />}
          {content && <RenderDraftjs {...content} />}
        </Content>
      </Container>
    </>
  );
};

export default WebTemplateHomeDesktop;
