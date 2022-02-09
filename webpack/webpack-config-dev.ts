/* eslint-disable import/no-extraneous-dependencies */
import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';
import ReactRefresh from '@pmmmwh/react-refresh-webpack-plugin';
import 'webpack-dev-server';

import webpackBaseConfig from './webpack-config-base';

dotenv.config();

const envNames = [
  'WEBPACK_DEV_SERVER_PORT',
  'GRAPHQL_SUBSCRIPTION_ENDPOINT',
  'GRAPHQL_ENDPOINT',
  'SERVER_PORT',
  'SERVER_HOSTNAME',
];

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

const appConfig = {
  analyze: process.env.ANALYZE === 'true',
  graphql: {
    endpoint: process.env.GRAPHQL_ENDPOINT,
    subscriptions: process.env.GRAPHQL_SUBSCRIPTION_ENDPOINT,
  },
  server: {
    hostname: process.env.SERVER_HOSTNAME,
    port: Number(process.env.SERVER_PORT),
  },
  webpack: {
    port: Number(process.env.WEBPACK_DEV_SERVER_PORT),
  },
};

const injectedEnv = {
  GRAPHQL_ENDPOINT: appConfig.graphql.endpoint,
  GRAPHQL_SUBSCRIPTION_ENDPOINT: appConfig.graphql.subscriptions,
};
const injectedEnvString = Buffer.from(JSON.stringify(injectedEnv), 'utf-8').toString('base64');

const template = fs.readFileSync(path.resolve(__dirname, '../assets/template.html'), {
  encoding: 'utf8',
});

// inject env as window._env global object
const html = template.replace(
  '<script data-type="env-environments">',
  `<script data-type="env-environments">window._env='${injectedEnvString}';</script>`,
);

const webpackDevConfig: Configuration = merge(webpackBaseConfig, {
  mode: 'development',
  entry: path.resolve(__dirname, '../src/app.tsx'),
  output: {
    path: path.join(__dirname, '../build/public/'),
    publicPath: '/',
    filename: '[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      templateContent: html,
      favicon: path.resolve(__dirname, '../assets/favicon.png'),
      filename: 'index.html',
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: appConfig.analyze ? 'server' : 'disabled',
      openAnalyzer: true,
    }),
    new ReactRefresh(),
  ],
  devtool: 'inline-source-map',
  devServer: {
    client: {
      progress: true,
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: true,
    },
    hot: true,
    compress: true,
    port: appConfig.server.port,
    host: appConfig.server.hostname,
  },
  performance: {
    hints: false,
  },
});

export default webpackDevConfig;
