import * as React from 'react';
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  EditorState,
  LexicalNode,
  TextNode,
  $isTextNode,
  $isRootNode,
  $isParagraphNode,
  createEditor,
} from 'lexical';
import { $isHeadingNode, $isQuoteNode, HeadingNode, QuoteNode } from '@lexical/rich-text';
import { $isListItemNode, $isListNode, ListNode, ListItemNode } from '@lexical/list';
import { $isLinkNode, LinkNode } from '@lexical/link';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';

// type EditorState = any;
// type TextNode = any;
// type LexicalNode = any;
// type RootNode = any;

export const serializeToHtml = async (editorState: EditorState): Promise<string> => {
  const renderText = (node: TextNode) => {
    switch (node.getFormat()) {
      case 1: // bold
        return `<strong>${node.getTextContent()}</strong>`;
      case 1 << 1: // italic
        return `<em>${node.getTextContent()}</em>`;
      case 1 << 2: // strikethrough
        return `<s>${node.getTextContent()}</s>`;
      case 1 << 3: // underline
        return `<u>${node.getTextContent()}</u>`;
      case 1 << 4: // code
        return `<code>${node.getTextContent()}</code>`;
      case 1 << 5: // subscript
        return `<sub>${node.getTextContent()}</sub>`;
      case 1 << 6: // superscript
        return `<sup>${node.getTextContent()}</sup>`;
      default:
        return node.getTextContent();
    }
  };

  const renderStyle = (format: number) => {
    switch (format) {
      case 1: // left
        return `text-align: left;`;
      case 2: // center
        return `text-align: center;`;
      case 3: // right
        return `text-align: right;`;
      case 4: // justify
        return `text-align: justify;`;
      default:
        // justify
        console.debug('unknown text-align', format);

        return ``;
    }
  };

  const renderNode = (node: LexicalNode) => {
    if ($isRootNode(node)) {
      return node
        .getChildren()
        .map(k => renderNode(k))
        .join('');
    }

    if ($isHeadingNode(node)) {
      return `<${node.getTag()}>${node
        .getChildren()
        .map(k => renderNode(k))
        .join('')}</${node.getTag()}>`;
    }

    if ($isListNode(node)) {
      return `<${node.getTag()}>${node
        .getChildren()
        .map(k => renderNode(k))
        .join('')}</${node.getTag()}>`;
    }

    if ($isTextNode(node) || node.getType() === 'text') {
      if ($isTextNode(node)) {
        return renderText(node);
      }

      return '';
    }

    if ($isQuoteNode(node)) {
      return `<blockquote>${node
        .getChildren()
        .map(k => renderNode(k))
        .join('')}</blockquote>`;
    }

    if ($isParagraphNode(node)) {
      return `<p${node.getFormat() ? ` style="${renderStyle(node.getFormat())}"` : ``}>${node
        .getChildren()
        .map(k => renderNode(k))
        .join('')}</p>`;
    }

    if ($isListItemNode(node)) {
      return `<li>${node
        .getChildren()
        .map(k => renderNode(k))
        .join('')}</li>`;
    }

    if ($isLinkNode(node)) {
      return `<a href="${node.getURL()}">${node
        .getChildren()
        .map(k => renderNode(k))
        .join('')}</a>`;
    }

    console.debug('unknown type', node.getType());

    return '';
  };

  return new Promise(resolve => {
    editorState.read(() => {
      resolve(renderNode($getRoot()));
    });
  });
};
const initialState = {
  editorState: {
    root: {
      children: [
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Welcome to the playground',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'heading',
          version: 1,
          tag: 'h1',
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: "In case you were wondering what the black box at the bottom is – it's the debug view, showing the current state of editor. You can disable it by pressing on the settings control in the bottom-left of your screen and toggling the debug view setting.",
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'quote',
          version: 1,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'The playground is a demo environment built with ',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 16,
              mode: 'normal',
              style: '',
              text: '@lexical/react',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: '. Try typing in ',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 1,
              mode: 'normal',
              style: '',
              text: 'some text',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: ' with ',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 2,
              mode: 'normal',
              style: '',
              text: 'different',
              type: 'text',
              version: 1,
            },
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: ' formats.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: 'Make sure to check out the various plugins in the toolbar.',
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: "If you'd like to find out more about Lexical, you can:",
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
        {
          children: [
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Visit the ',
                  type: 'text',
                  version: 1,
                },
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'Lexical website',
                      type: 'text',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  type: 'link',
                  version: 1,
                  url: 'https://lexical.dev/',
                },
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: ' for documentation and more information.',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'listitem',
              version: 1,
              value: 1,
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Check out the code on our ',
                  type: 'text',
                  version: 1,
                },
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'GitHub repository',
                      type: 'text',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  type: 'link',
                  version: 1,
                  url: 'https://github.com/facebook/lexical',
                },
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: '.',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'listitem',
              version: 1,
              value: 2,
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Playground code can be found ',
                  type: 'text',
                  version: 1,
                },
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'here',
                      type: 'text',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  type: 'link',
                  version: 1,
                  url: 'https://github.com/facebook/lexical/tree/main/packages/lexical-playground',
                },
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: '.',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'listitem',
              version: 1,
              value: 3,
            },
            {
              children: [
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: 'Join our ',
                  type: 'text',
                  version: 1,
                },
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'Discord Server',
                      type: 'text',
                      version: 1,
                    },
                  ],
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  type: 'link',
                  version: 1,
                  url: 'https://discord.com/invite/KmG4wQnnD9',
                },
                {
                  detail: 0,
                  format: 0,
                  mode: 'normal',
                  style: '',
                  text: ' and chat with the team.',
                  type: 'text',
                  version: 1,
                },
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              type: 'listitem',
              version: 1,
              value: 4,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'list',
          version: 1,
          listType: 'bullet',
          start: 1,
          tag: 'ul',
        },
        {
          children: [
            {
              detail: 0,
              format: 0,
              mode: 'normal',
              style: '',
              text: "Lastly, we're constantly adding cool new features to this playground. So make sure you check back here when you next get a chance.",
              type: 'text',
              version: 1,
            },
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          type: 'paragraph',
          version: 1,
        },
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  },
  lastSaved: 1654756815227,
  source: 'Playground',
  version: '0.3.2',
};

const RenderLexical: React.FC = () => {
  const editorRef = React.useRef(
    createEditor({
      nodes: [HeadingNode, ListNode, LinkNode, QuoteNode, ListItemNode],
      onError: console.error,
    }),
  );
  const [html, setHTML] = React.useState('');
  React.useEffect(() => {
    editorRef.current.parseEditorState(initialState.editorState)._nodeMap.get('root');
    serializeToHtml(editorRef.current.parseEditorState(initialState.editorState)).then(h =>
      setHTML(h),
    );
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
  // console.log();
  // return <div ref={editorRootRef} />;

  // return (
  //   <LexicalComposer
  //     initialConfig={{
  //       readOnly: true,
  //       onError: console.error,
  //     }}
  //   >
  //     <PlainTextPlugin
  //       contentEditable={<ContentEditable />}
  //       // initialEditorState={() => {
  //       //   const root = $getRoot();
  //       //   const paragraph = $createParagraphNode();
  //       //   paragraph.append($createTextNode('Some plain text'));
  //       //   root.append(paragraph);
  //       // }}
  //       placeholder={null}
  //     />
  //   </LexicalComposer>
  // );
};
export default RenderLexical;
