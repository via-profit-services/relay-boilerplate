/* eslint-disable import/max-dependencies */
import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http';
import stream from 'node:stream';
import Mustache from 'mustache';
import React from 'react';
import { ChunkExtractor } from '@loadable/server';
import { renderToString } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { StaticRouter } from 'react-router-dom/server';
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';
import { Provider as ReduxProvider } from 'react-redux';
import { fetchQuery, RelayEnvironmentProvider } from 'react-relay';
import { Network, Store, RecordSource, Environment } from 'relay-runtime';
import dotenv from 'dotenv';

import App from '~/containers/App';
import Fallback from '~/components/both/ErrorBoundary/Fallback';
import relayFetch from '~/server/relay-fetch';
import createReduxStore from '~/redux/store';
import reduxDefaultState from '~/redux/defaultState';
import query, { TemplateRenderQuery } from '~/relay/artifacts/TemplateRenderQuery.graphql';

interface Props {
  readonly req: http.IncomingMessage;
  readonly res: http.ServerResponse;
  readonly graphqlEndpoint: string;
  readonly graphqlSubscriptions: string;
}

type RenderHTMLPayload = {
  stream: stream.Readable;
  statusCode: number;
};

dotenv.config();

const renderHTML = async (props: Props): Promise<RenderHTMLPayload> => {
  const { req, graphqlEndpoint, graphqlSubscriptions } = props;
  const { url, headers } = req;
  const relayNework = Network.create(relayFetch({ graphqlEndpoint, graphqlSubscriptions }));
  const relayStore = new Store(new RecordSource());
  const environment = new Environment({
    network: relayNework,
    store: relayStore,
    isServer: true,
  });

  let statusCode = 404;
  await fetchQuery<TemplateRenderQuery>(environment, query, {
    path: String(url),
  })
    .toPromise()
    .then(resp => {
      if (resp) {
        statusCode = resp?.webpages.resolvePage.statusCode;
      }
    })
    .catch(err => {
      console.error(err);
      statusCode = 500;
    });

  const relayStoreRecords = environment.getStore().getSource().toJSON();

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
  const allowedLocales: LocaleVariants[] = ['ru-RU'];

  // Fill the redux store
  const preloadedStates: PreloadedStates = {
    RELAY: {
      store: relayStoreRecords,
      graphqlEndpoint,
      graphqlSubscriptions,
    },
    REDUX: {
      theme: allowedThemes.includes(cookies.theme) ? cookies.theme : reduxDefaultState.theme,
      locale: allowedLocales.includes(cookies.locale) ? cookies.locale : reduxDefaultState.locale,
    },
  };
  const preloadedStatesBase64 = Buffer.from(JSON.stringify(preloadedStates)).toString('base64');
  const reduxStore = createReduxStore(preloadedStates.REDUX);
  const webExtractor = new ChunkExtractor({
    statsFile: path.resolve(__dirname, './public/loadable-stats.json'),
    entrypoints: ['app'],
  });
  const sheet = new ServerStyleSheet();
  const htmlContent = renderToString(
    webExtractor.collectChunks(
      <StyleSheetManager sheet={sheet.instance}>
        <StaticRouter location={String(url)}>
          <ReduxProvider store={reduxStore}>
            <RelayEnvironmentProvider environment={environment}>
              {statusCode === 500 ? <Fallback /> : <App />}
            </RelayEnvironmentProvider>
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
    preloadedStatesBase64,
    styleTags,
    extractor: {
      scriptTags: webExtractor.getScriptTags(),
      linkTags: webExtractor.getLinkTags(),
      styleTags: webExtractor.getStyleTags(),
    },
    htmlContent,
  });

  return {
    stream: stream.Readable.from([html]),
    statusCode,
  };
};

export default renderHTML;
