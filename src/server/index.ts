/* eslint-disable no-console */
import dotenv from 'dotenv';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';

import { AppConfigProduction } from 'common';
import renderHTML from './renderHTML';

const envConfigFilename = path.resolve(process.cwd(), '.env');

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

  /**
   * Route
   * Static files serve
   */
  if (method === 'GET' && (url || '').match(/^\/public/)) {
    const mimeTypes: Record<string, string[]> = {
      'application/json': ['.json'],
      'application/javascript': ['.js'],
      'text/html': ['.html'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/webp': ['.webp'],
      'video/mp4': ['.mp4'],
      'audio/mpeg': ['.mp3'],
      'text/plain': ['.txt'],
      'font/ttf': ['.ttf'],
      'font/otf': ['.otf'],
      'font/woff': ['.woff'],
      'font/woff2': ['.woff2'],
      'application/vnd.ms-fontobject': ['.eot'],
      'image/vnd.microsoft.iconplain': ['.ico'],
    };
    const publicPath = path.resolve(__dirname, './public/');
    const filename = path.join(__dirname, url || '');
    const relative = path.relative(publicPath, filename);
    const fileExists = fs.existsSync(filename);
    const ext = path.extname(filename);

    if (!fileExists) {
      console.log('File not found', { filename, url, method, ext });
      res.statusCode = 404;
      res.end();
    }

    if (fileExists && relative && !relative.startsWith('..') && !path.isAbsolute(relative)) {
      const stat = fs.statSync(filename);
      const stream = fs.createReadStream(filename);

      // get mimetype
      const mimeType = Object.entries(mimeTypes).find(([_mimeType, data]) =>
        data.includes(ext),
      )?.[0];

      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', mimeType || 'plain/text');
      res.statusCode = 200;

      stream.pipe(res);

      return;
    }

    res.statusCode = 404;
    res.end();

    return;
  }

  /**
   * Route
   * favicon.ico
   */
  if (method === 'GET' && String(url) === '/favicon.ico') {
    res.statusCode = 404;
    res.end();

    return;
  }

  /**
   * Route
   * Block Google, Bing, Yandex crawlers at simple robots.txt file
   */
  if (method === 'GET' && String(url).match(/^robots\.txt$/)) {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.write('User-agent: *\nDisallow: /\n');
    res.end();

    return;
  }

  /**
   * Route
   * Serve the html
   */
  if (method === 'GET') {
    try {
      const { html, statusCode } = await renderHTML({ req, res });
      res.statusCode = statusCode;
      res.setHeader('Content-Type', 'text/html');
      res.write(html);
      res.end();
    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.end();
    }

    return;
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
