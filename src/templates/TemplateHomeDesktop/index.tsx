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
import RenderLexical from '~/components/RenderLexical';

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

const TemplateHomeDesktopFragment: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const theme = useTheme();
  const { meta, contentBlocks } = useFragment<TemplateHomeDesktopFragment$key>(
    fragment,
    fragmentRef,
  );

  const contentMap = React.useMemo(
    () => ({
      h1: contentBlocks?.find(({ name }) => name === 'h1')?.content?.plainContent,
      content: contentBlocks?.find(({ name }) => name === 'content')?.content?.lexicalContent,
    }),
    [contentBlocks],
  );
  const { h1, content } = contentMap;

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
          {/* <RenderLexical /> */}
          {h1 && <PageTitle>{h1}</PageTitle>}
          {/* {slider && <MainSliderBlock {...slider.content} />} */}
          {content && <>Cusom content here: {JSON.stringify(content)}</>}
          <br />
          <br />
          <Link to="/about">To about</Link>
        </Content>
      </Container>
    </>
  );
};

export default TemplateHomeDesktopFragment;

graphql`
  fragment TemplateHomeDesktopFragment on Page {
    id
    meta {
      locale
      title
      description
    }
    contentBlocks {
      id
      name
      type
      content {
        ... on PageContentBlockContentString {
          plainContent: value
        }
        ... on PageContentBlockContentLexical {
          lexicalContent: value
        }
      }
    }
  }
`;
