import * as React from 'react';
import styled from '@emotion/styled';
import { Global, css, useTheme } from '@emotion/react';
import { graphql, useFragment } from 'react-relay';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';

// import Header from '~/components/Header';
import PageTitle from '~/components/PageTitle';
import RenderDraftjs from '~/components/RenderDraftjs';
import fragment, {
  TemplateSecondDesktopFragment$key,
  TemplateSecondDesktopFragment$data,
} from '~/relay/artifacts/TemplateSecondDesktopFragment.graphql';
import parseContentBlocks from '~/utils/parseContentBlocks';

type Props = {
  fragmentRef: TemplateSecondDesktopFragment$key;
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

const TemplateSecondDesktopFragment: React.FC<Props> = props => {
  const { fragmentRef } = props;
  const theme = useTheme();
  const { meta, contentBlocks } = useFragment<TemplateSecondDesktopFragment$key>(
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

  // const { h1, content } = parseContentBlocks<ContentMap>(contentBlocksRecords);

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
          {h1 && <PageTitle>{h1}</PageTitle>}
          {content && <>Cusom content here: {JSON.stringify(content)}</>}
          <br />
          <br />
          <Link to="/">To home</Link>
        </Content>
      </Container>
    </>
  );
};

export default TemplateSecondDesktopFragment;

graphql`
  fragment TemplateSecondDesktopFragment on Page {
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
