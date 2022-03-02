import { createGlobalStyle } from 'styled-components';

import { FontSize } from '~/relay/artifacts/TemplateRenderQuery.graphql';

const GlobalStyles = createGlobalStyle<{ fontSize: FontSize }>`
  :root {
    --font-size-small: ${({ theme }) => theme.fontSize.small}px;
    --font-size-normal: ${({ theme }) => theme.fontSize.normal}px;
    --font-size-medium: ${({ theme }) => theme.fontSize.medium}px;
    --font-size-large: ${({ theme }) => theme.fontSize.large}px;
  };

  html {
    height: 100%;
    font-weight: 400;
    font-family: system-ui;
    font-size: var(--font-size-${props => props.fontSize});
  }
  body {
    margin: 0;
    overflow-wrap: break-word;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.defaultBackground};
    color: ${({ theme }) => theme.colors.defaultText};
  }
  #app {
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }

  * {
    box-sizing: border-box;
  }

  .ReactModal__Overlay {
    opacity: 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: opacity 120ms ease-in-out;
    background-color: rgba(0, 0, 0, 0.2);
  }

  .ReactModal__Overlay--after-open{
    opacity: 1;
  }

  .ReactModal__Overlay--before-close{
    opacity: 0;
  }

  .ReactModal__Content {
    position: absolute;
    top: 50%;
    left: 50%;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    transform: translate(-50%, -50%);
    outline: none;
    transform: translateY(10px);
    transition: transform 100ms ease-in-out;
  }

  .ReactModal__Content--after-open{
    transform: translateY(0);
    transition-duration: 160ms;
  }

  .ReactModal__Content--before-close{
    transform: translateY(300px);
  }
`;

export default GlobalStyles;
