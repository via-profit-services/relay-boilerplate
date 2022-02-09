import dotenv from 'dotenv';
import NodemonPlugin from 'nodemon-webpack-plugin';
import path from 'path';
import { Configuration, HotModuleReplacementPlugin } from 'webpack';
import { merge } from 'webpack-merge';

import webpackBaseConfig from './webpack-config-base';

dotenv.config();

const webpackServerConfig: Configuration = merge(webpackBaseConfig, {
  target: 'node',
  mode: 'development',
  entry: path.resolve(__dirname, '../src/server/index.ts'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'index.js',
  },
  node: {
    __filename: false,
    __dirname: false,
  },
  plugins: [
    new NodemonPlugin({
      exec: process.env.DEBUG
        ? 'yarn node --inspect=9229 ./build/server.js'
        : 'yarn node ./build/server.js',
      watch: ['./build/server.js'],
    }) as any,
    new HotModuleReplacementPlugin(),
  ],
});

export default webpackServerConfig;
