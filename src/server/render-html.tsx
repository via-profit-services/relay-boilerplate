/* eslint-disable import/max-dependencies */
import path from 'node:path';
import crypto from 'node:crypto';
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
import { fetchQuery, RelayEnvironmentProvider } from 'react-relay';
import { Network, Store, RecordSource, Environment } from 'relay-runtime';
import { Provider as ReduxProvider } from 'react-redux';
import dotenv from 'dotenv';
import type { Redis } from 'ioredis';

import RootRouter from '~/routes/RootRouter';
import Fallback from '~/components/both/ErrorBoundary/Fallback';
import relayFetch from '~/server/relay-fetch';
import reduxDefaultState from '~/redux/defaultState';
import createReduxStore from '~/redux/store';
import relayStoreRecords from '~/relay/default-store-records.json';
import query, { TemplateRenderQuery } from '~/relay/artifacts/TemplateRenderQuery.graphql';

interface Props extends AppConfigProduction {
  readonly req: http.IncomingMessage;
  readonly res: http.ServerResponse;
  readonly redis: Redis;
}

interface Cookies {
  theme?: unknown;
  locale?: unknown;
  fontSize?: unknown;
}

type RenderHTMLPayload = {
  stream: stream.Readable;
  statusCode: number;
};

dotenv.config();

const renderHTML = async (props: Props): Promise<RenderHTMLPayload> => {
  const { req, graphqlEndpoint, graphqlSubscriptions, htmlCacheExp, redis } = props;
  const { url, headers } = req;

  // Parsing cookies
  const cookies: Cookies = {};
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

  const isValidTheme = (value: unknown): value is ThemeName => {
    const variants: ThemeName[] = ['standardDark', 'standardLight'];

    return typeof value === 'string' && variants.includes(value as ThemeName);
  };

  const isValidLocale = (value: unknown): value is LocaleName => {
    const variants: LocaleName[] = ['ru-RU'];

    return typeof value === 'string' && variants.includes(value as LocaleName);
  };
  const isValidFontSize = (value: unknown): value is FontSize => {
    const variants: FontSize[] = ['small', 'normal', 'medium', 'large'];

    return typeof value === 'string' && variants.includes(value as FontSize);
  };

  // Generate uniqu cache key
  // Key contain URL and the cookies
  // Do not use all cookies. Only needable
  const cacheKey = crypto
    .createHash('sha256')
    .update(
      JSON.stringify({
        path: url,
        theme: cookies.theme,
        fontSize: cookies.fontSize,
        locale: cookies.locale,
      }),
    )
    .digest('hex');

  if (htmlCacheExp > 0) {
    // Try to get cache from Redis by user cache key
    const cachedHTMLData = await redis.get(`cache:${cacheKey}`);
    if (cachedHTMLData) {
      try {
        const { statusCode, html } = JSON.parse(cachedHTMLData);

        return {
          stream: stream.Readable.from([html]),
          statusCode,
        };
      } catch (err) {
        // do nothing
      }
    }
  }

  const defaultUIVars = reduxDefaultState.ui;

  // Configure Relay
  const relayNework = Network.create(relayFetch({ graphqlEndpoint, graphqlSubscriptions }));
  const relayStore = new Store(new RecordSource(relayStoreRecords));
  const relayEnvironment = new Environment({
    network: relayNework,
    store: relayStore,
    isServer: true,
  });

  const preloadedStates: PreloadedStates = {
    RELAY: {
      store: relayEnvironment.getStore().getSource().toJSON(),
      graphqlEndpoint,
      graphqlSubscriptions,
    },
    REDUX: {
      store: {
        ...reduxDefaultState,
        ui: {
          ...defaultUIVars,
          theme: isValidTheme(cookies.theme) ? cookies.theme : defaultUIVars.theme,
          locale: isValidLocale(cookies.locale) ? cookies.locale : defaultUIVars.locale,
          fontSize: isValidFontSize(cookies.fontSize) ? cookies.fontSize : defaultUIVars.fontSize,
        },
      },
    },
  };

  const reduxStore = createReduxStore(preloadedStates.REDUX.store);

  let statusCode = 404;

  // Fill Relay store by fetching request
  await fetchQuery<TemplateRenderQuery>(relayEnvironment, query, {
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

  const sheet = new ServerStyleSheet();
  const preloadedStatesBase64 = Buffer.from(JSON.stringify(preloadedStates)).toString('base64');
  const webExtractor = new ChunkExtractor({
    statsFile: path.resolve(__dirname, './public/loadable-stats.json'),
    entrypoints: ['app'],
  });

  // If «fetchQuery» was executed successfully, then we can render the
  // application without worrying about <Suspense />.
  // But if the request, for some reason, failed with an error (statusCode = 500),
  // we will have to render the <Fallback /> component, since in
  // this case «React» will fail with an error
  const htmlContent = renderToString(
    webExtractor.collectChunks(
      <StyleSheetManager sheet={sheet.instance}>
        <StaticRouter location={String(url)}>
          <ReduxProvider store={reduxStore}>
            <RelayEnvironmentProvider environment={relayEnvironment}>
              {statusCode === 500 ? <Fallback /> : <RootRouter />}
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

  // Save already renderer HTML into the Redis cache
  if (htmlCacheExp > 0) {
    const cacheData = JSON.stringify({
      statusCode,
      html,
    });
    await redis.set(`cache:${cacheKey}`, cacheData, 'EX', htmlCacheExp);
  }

  return {
    stream: stream.Readable.from([html]),
    statusCode,
  };
};

export default renderHTML;
