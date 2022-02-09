import dotenv from 'dotenv';
import path from 'path';
import { Configuration } from 'webpack';
import { merge } from 'webpack-merge';

import webpackBaseConfig from './webpack-config-base';

dotenv.config();

const webpackServerConfig: Configuration = merge(webpackBaseConfig, {
  target: 'node',
  mode: 'production',
  entry: path.resolve(__dirname, '../src/server/index.ts'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'index.js',
  },
  node: {
    __filename: false,
    __dirname: false,
  },
});

export default webpackServerConfig;
