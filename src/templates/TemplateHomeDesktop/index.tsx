import * as React from 'react';
import styled from '@emotion/styled';
import { Global, css, useTheme } from '@emotion/react';
import { graphql, useFragment } from 'react-relay';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

// import Header from '~/components/Header';
import MainSliderBlock from '~/components/MainSliderBlock';
import PageTitle from '~/components/PageTitle';
import RenderDraftjs from '~/components/RenderDraftjs';
import fragment, {
  TemplateHomeDesktopFragment$key,
  TemplateHomeDesktopFragment$data,
} from '~/relay/artifacts/TemplateHomeDesktopFragment.graphql';
import parseContentBlocks from '~/utils/parseContentBlocks';

type Props = {
  fragmentRef: TemplateHomeDesktopFragment$key;
};

const Container = styled.div`
  display: flex;
  flex-flow: column;
  min-height: 100vh;
`;

const Content = styled.div`
  padding: 20px;
  flex: 1;
`;

type ContentBlockString = Exclude<
  NonNullable<TemplateHomeDesktopFragment$data['cbString']>[0],
  {
    readonly __typename: '%other';
  }
>;

type ContentBlockJSON = Exclude<
  NonNullable<TemplateHomeDesktopFragment$data['cbJSON']>[0],
  {
    readonly __typename: '%other';
  }
>;

type ContentBlockSlider = Exclude<
  NonNullable<TemplateHomeDesktopFragment$data['cbSlider']>[0],
  {
    readonly __typename: '%other';
  }
>;

type ContentMap = {
  readonly h1?: ContentBlockString;
  readonly content?: ContentBlockJSON;
  readonly slider?: ContentBlockSlider;
};

const TemplateHomeDesktopFragment: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const theme = useTheme();
  const { meta, ...contentBlocksRecords } = useFragment<TemplateHomeDesktopFragment$key>(
    fragment,
    fragmentRef,
  );

  const { slider, h1, content } = parseContentBlocks<ContentMap>(contentBlocksRecords);

  return (
    <>
      <Helmet htmlAttributes={{ lang: meta.locale }}>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
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
        {/* <Header fragmentRef={menuFragment} /> */}
        <Content>
          {h1 && <PageTitle>{h1.content}</PageTitle>}
          {slider && <MainSliderBlock {...slider.content} />}
          {content && <RenderDraftjs {...content.content} />}
          <Link to="/about">To about</Link>
        </Content>
      </Container>
    </>
  );
};

export default TemplateHomeDesktopFragment;

graphql`
  fragment TemplateHomeDesktopFragment on WebPage {
    id
    meta {
      locale
      title
      description
    }
    cbString: contentBlocks {
      ... on WebPageContentBlockString {
        __typename
        id
        name
        content
      }
    }
    cbJSON: contentBlocks {
      ... on WebPageContentBlockJSON {
        __typename
        id
        name
        content
      }
    }
    cbSlider: contentBlocks {
      ... on WebPageContentBlockSlider {
        __typename
        name
        content {
          autoplay
          delay
          slides {
            image {
              id
              url
            }
          }
        }
      }
    }
  }
`;
