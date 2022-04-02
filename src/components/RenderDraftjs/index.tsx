/* eslint-disable react/destructuring-assignment */
import * as React from 'react';
import Redraft, { RawDraftContentState } from 'redraft';

import Paragraph from '~/components/Typography/Paragraph';
import Del from '~/components/Typography/Del';
import Span from '~/components/Typography/Span';
import U from '~/components/Typography/U';
import Strong from '~/components/Typography/Strong';
import Em from '~/components/Typography/Em';
import H1 from '~/components/Typography/H1';
import H2 from '~/components/Typography/H2';
import H3 from '~/components/Typography/H3';
import H4 from '~/components/Typography/H4';
import H5 from '~/components/Typography/H5';
import { Ul, Ol, Li } from '~/components/Typography/List';

type Props = {
  readonly blocks: RawDraftContentState['blocks'];
  readonly entityMap: RawDraftContentState['entityMap'];
};

const renderDraftJs = (rawData: RawDraftContentState): React.ReactNode =>
  Redraft(rawData, {
    inline: {
      STRIKETHROUGH: (children, { key }) => <Del key={key}>{children}</Del>,
      BOLD: (children, { key }) => <Strong key={key}>{children}</Strong>,
      ITALIC: (children, { key }) => <Em key={key}>{children}</Em>,
      UNDERLINE: (children, { key }) => <U key={key}>{children}</U>,
      CODE: (children, { key }) => <Span key={key}>{children}</Span>,
    },
    blocks: {
      UNSTYLED: children =>
        children.map((child, index) => <Paragraph key={index.toString()}>{child}</Paragraph>),
      HEADER_ONE: children =>
        children.map((child, index) => <H1 key={index.toString()}>{child}</H1>),
      HEADER_TWO: children =>
        children.map((child, index) => <H2 key={index.toString()}>{child}</H2>),
      HEADER_THREE: children =>
        children.map((child, index) => <H3 key={index.toString()}>{child}</H3>),
      HEADER_FOUR: children =>
        children.map((child, index) => <H4 key={index.toString()}>{child}</H4>),
      HEADER_FIVE: children =>
        children.map((child, index) => <H5 key={index.toString()}>{child}</H5>),
      // or depth for nested lists
      UNORDERED_LIST_ITEM: (children, { depth, keys }) => (
        <Ul key={keys[keys.length - 1]} className={`ul-level-${depth}`}>
          {children.map((child, index) => (
            <Li key={index.toString()}>{child}</Li>
          ))}
        </Ul>
      ),
      ORDERED_LIST_ITEM: (children, { depth, keys }) => (
        <Ol key={keys.join('|')} className={`ol-level-${depth}`}>
          {children.map((child, index) => (
            <Li key={keys[index]}>{child}</Li>
          ))}
        </Ol>
      ),
    },
  });

const RenderDraftjs: React.FC<Props> = props => {
  const { blocks, entityMap } = props;

  return <>{renderDraftJs({ blocks, entityMap })}</>;
};

export default RenderDraftjs;
