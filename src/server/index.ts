/* eslint-disable no-console */
import dotenv from 'dotenv';
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

import { AppConfigProduction } from 'common';

const envConfigFilename = path.resolve(process.cwd(), '.env');
const publicPath = path.resolve(__dirname, './public');
const envNames = [
  'GRAPHQL_SUBSCRIPTION_ENDPOINT',
  'GRAPHQL_ENDPOINT',
  'SERVER_PORT',
  'SERVER_HOSTNAME',
];

dotenv.config({ path: envConfigFilename });

// Checks for variables in .env
envNames.map(envName => {
  if (process.env[envName] === undefined) {
    console.error('\x1b[31m%s\x1b[0m', 'Configuration error');
    console.error('\x1b[31m%s\x1b[0m', `Variable «${envName}» does not found in process.env`);
    console.error(
      '\x1b[31m%s\x1b[0m',
      'Make sure that the «.env» file is present in the root of the project  and it contains the required value then restart the application',
    );
    process.exit(0);
  }
});

const appConfig: AppConfigProduction = {
  graphql: {
    endpoint: process.env.GRAPHQL_ENDPOINT || '',
    subscriptions: process.env.GRAPHQL_SUBSCRIPTION_ENDPOINT || '',
  },
  server: {
    hostname: process.env.SERVER_HOSTNAME || '',
    port: Number(process.env.SERVER_PORT),
  },
};
const server = http.createServer();

server.on('request', async (req, res) => {
  const { url, method } = req;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Authorization, Content-Type, Accept, Content-Length',
  );
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' 'unsafe-inline' ws: wss: http: https: data: blob:",
  );

  if (method === 'GET' && (url || '').match(/^\/public/)) {
    res.setHeader('Content-Type', 'text/html');
    res.write('Public files');
    res.end();

    return;
  }

  /**
   * Route
   * Block Google, Bing, Yandex crawlers at simple robots.txt file
   */
  if (method === 'GET' && (url || '').match(/^robots\.txt$/)) {
    const filepath = path.resolve(publicPath, 'robots.txt');

    if (!fs.existsSync(filepath)) {
      res.statusCode = 404;
      res.end();

      return;
    }

    res.setHeader('Content-Type', 'text/plain');
    const stream = fs.createReadStream(filepath, { encoding: 'utf-8' });
    stream.pipe(res);
    res.end();
  }

  /**
   * Route
   * Serve the html
   */
  if (method === 'GET') {
    const filepath = path.resolve(publicPath, 'index.html');
    if (!fs.existsSync(filepath)) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html');
      res.write('<h1>Content is missing</h1>');
      res.end();

      return;
    }

    const template = fs.readFileSync(filepath, {
      encoding: 'utf8',
    });

    const injectedEnv = {
      GRAPHQL_ENDPOINT: appConfig.graphql.endpoint,
      GRAPHQL_SUBSCRIPTION_ENDPOINT: appConfig.graphql.subscriptions,
    };

    // convert env params to Base64 string
    const injectedEnvString = Buffer.from(JSON.stringify(injectedEnv), 'utf-8').toString('base64');

    // inject env as window._env global object
    const html = template.replace(
      '<script data-type="env-environments"></script>',
      `<script data-type="env-environments">window._env='${injectedEnvString}';</script>`,
    );

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write(html);
    res.end();
  }
});

// Start the http server to serve HTML page
server.listen(appConfig.server.port, appConfig.server.hostname, () => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(
      `\nServer was started at http://${appConfig.server.hostname}:${appConfig.server.port}`,
    );
  }
});
