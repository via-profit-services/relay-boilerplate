/* eslint-disable no-console */
import dotenv from 'dotenv';
import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs';
import zlib from 'node:zlib';
import IORedis from 'ioredis';

import renderHTML from '~/server/render-html';

const envConfigFilename = path.resolve(process.cwd(), '.env');

const envNames = [
  'GRAPHQL_SUBSCRIPTION_ENDPOINT',
  'GRAPHQL_ENDPOINT',
  'SERVER_PORT',
  'SERVER_HOSTNAME',
  'HTML_CACHE_EXP',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_PASSWORD',
  'REDIS_DB',
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
  graphqlEndpoint: process.env.GRAPHQL_ENDPOINT || '',
  graphqlSubscriptions: process.env.GRAPHQL_SUBSCRIPTION_ENDPOINT || '',
  serverHostname: process.env.SERVER_HOSTNAME || '',
  serverPort: Number(process.env.SERVER_PORT),
  htmlCacheExp: Number(process.env.HTML_CACHE_EXP),
  redisHost: process.env.REDIS_HOST || '',
  redisPassword: process.env.REDIS_PASSWORD || '',
  redisPort: Number(process.env.REDIS_PORT),
  redisDatabase: Number(process.env.REDIS_DB),
};
const server = http.createServer();
const redis = new IORedis({
  host: appConfig.redisHost,
  port: appConfig.redisPort,
  password: appConfig.redisPassword,
  db: appConfig.redisDatabase,
});

server.on('request', async (req, res) => {
  const { url, method } = req;
  const acceptEncoding = String(req.headers?.['accept-encoding'] || '')
    .split(',')
    .map(value => value.trim());
  res.setHeader('access-control-allow-origin', '*');
  res.setHeader('access-control-allow-methods', 'GET, POST, OPTIONS');
  res.setHeader(
    'access-control-allow-headers',
    'Authorization, Content-Type, Accept, Content-Length',
  );
  res.setHeader('access-control-allow-credentials', 'true');
  res.setHeader(
    'content-security-policy',
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
      'text/css': ['.css'],
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
      // get mimetype
      const mimeType = Object.entries(mimeTypes).find(([_mimeType, data]) =>
        data.includes(ext),
      )?.[0];

      res.setHeader('content-type', mimeType || 'plain/text');
      res.setHeader('cache-control', `max-age=${86400 * 30}`); // 30 days
      res.statusCode = 200;

      switch (true) {
        case acceptEncoding.includes('br') && fs.existsSync(filename + '.br'):
          res.setHeader('content-encoding', 'br');
          fs.createReadStream(filename + '.br').pipe(res);

          return;

        default:
          fs.createReadStream(filename).pipe(res);

          return;
      }

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
    res.setHeader('content-type', 'text/plain');
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
      const { stream, statusCode } = await renderHTML({
        req,
        res,
        redis,
        ...appConfig,
      });
      res.statusCode = statusCode;
      res.setHeader('content-type', 'text/html; charset=UTF-8');

      switch (true) {
        case acceptEncoding.includes('br'):
          res.setHeader('content-encoding', 'br');
          stream.pipe(zlib.createBrotliCompress()).pipe(res);

          return;

        default:
          stream.pipe(res);

          return;
      }
    } catch (err) {
      console.error(err);
      res.statusCode = 500;
      res.end();
    }

    return;
  }
});

// Start the http server to serve HTML page
server.listen(appConfig.serverPort, appConfig.serverHostname, () => {
  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log(
      `\nServer was started at http://${appConfig.serverHostname}:${appConfig.serverPort}`,
    );
  }
});
