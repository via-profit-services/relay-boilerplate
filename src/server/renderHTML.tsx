/* eslint-disable import/max-dependencies */
import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http';
import Mustache from 'mustache';
import React from 'react';
import { ChunkExtractor } from '@loadable/server';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { StaticRouter } from 'react-router-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import dotenv from 'dotenv';
import { Provider as ReduxProvider } from 'react-redux';

import createReduxStore from '~/redux/store';
import reduxDefaultState from '~/redux/defaultState';
import App from '~/containers/App';

interface Props {
  req: http.IncomingMessage;
  res: http.ServerResponse;
}

type RenderHTMLPayload = {
  html: string;
  statusCode: number;
};

dotenv.config();

const renderHTML = async (props: Props): Promise<RenderHTMLPayload> => {
  const { req } = props;
  const { url, headers } = req;

  // Parsing cookies
  const cookies: Record<string, any> = {};
  String(headers.cookie)
    .split(';')
    .forEach(pair => {
      const index = pair.indexOf('=');
      if (index > -1) {
        const key = pair.substring(0, index).trim();

        let value = pair.substring(index + 1, pair.length).trim();
        if (value[0] === '"') {
          value = value.slice(1, -1);
        }
        cookies[key] = decodeURIComponent(value);
      }
    });

  const allowedThemes: ThemeVariants[] = ['standardDark', 'standardLight'];
  const allowedLocales: LocaleVariants[] = ['ru', 'en'];

  // Fill the redux store
  const reduxState: ReduxState = {
    theme: allowedThemes.includes(cookies.theme) ? cookies.theme : reduxDefaultState.theme,
    locale: allowedLocales.includes(cookies.locale) ? cookies.locale : reduxDefaultState.locale,
  };

  const reduxStore = createReduxStore(reduxState);
  const reduxStoreBase64 = Buffer.from(JSON.stringify(reduxState)).toString('base64');

  const webExtractor = new ChunkExtractor({
    statsFile: path.resolve(__dirname, './public/loadable-stats.json'),
    entrypoints: ['app'],
  });
  const sheet = new ServerStyleSheet();
  const htmlContent = renderToString(
    webExtractor.collectChunks(
      <StyleSheetManager sheet={sheet.instance}>
        <StaticRouter location={url || '/'}>
          <ReduxProvider store={reduxStore}>
            <App />
          </ReduxProvider>
        </StaticRouter>
      </StyleSheetManager>,
    ),
  );
  const helmet = Helmet.renderStatic();
  const styleTags = sheet.getStyleTags();

  sheet.seal();

  const templateFilename = path.resolve(__dirname, './server/index.mustache');
  const templateContent = fs.readFileSync(templateFilename, {
    encoding: 'utf8',
  });

  const html = Mustache.render(templateContent, {
    helmet: {
      title: helmet.title.toString(),
      base: helmet.base.toString(),
      meta: helmet.meta.toString(),
      link: helmet.link.toString(),
      script: helmet.script.toString(),
      noscript: helmet.noscript.toString(),
      style: helmet.style.toString(),
      htmlAttributes: helmet.htmlAttributes.toString(),
      bodyAttributes: helmet.bodyAttributes.toString(),
    },
    reduxStoreBase64,
    styleTags,
    extractor: {
      scriptTags: webExtractor.getScriptTags(),
      linkTags: webExtractor.getLinkTags(),
      styleTags: webExtractor.getStyleTags(),
    },
    htmlContent,
  });

  const statusCode = 200;
  const payload = { html, statusCode };

  return payload;
};

export default renderHTML;
