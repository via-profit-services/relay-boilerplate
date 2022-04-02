import path from 'node:path';
import dotenv from 'dotenv';
import { Configuration, ProgressPlugin, DefinePlugin } from 'webpack';
import { merge } from 'webpack-merge';
import nodeExternals from 'webpack-node-externals';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import webpackBaseConfig from './webpack-config-base';
import { version } from '../package.json';

dotenv.config();
const isDev = process.env.NODE_ENV === 'development';

const webpackServerConfig: Configuration = merge(webpackBaseConfig, {
  target: 'node',
  mode: isDev ? 'development' : 'production',
  entry: {
    index: path.resolve(__dirname, '../src/server/index.ts'),
  },
  output: {
    path: isDev ? path.join(__dirname, '../build') : path.join(__dirname, '../dist'),
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: 'server/js/[name].chunk.[chunkhash].js',
    assetModuleFilename: 'public/assets/[contenthash][ext]',
  },
  optimization: {
    minimize: !isDev,
  },
  node: {
    __filename: true,
    __dirname: false,
  },
  externals: isDev ? [nodeExternals()] : [],
  plugins: [
    new ProgressPlugin(),
    new MiniCssExtractPlugin({
      filename: 'public/css/[contenthash].css',
      chunkFilename: 'public/css/[contenthash].css',
    }),
    new DefinePlugin({
      SC_DISABLE_SPEEDY: process.env.SC_DISABLE_SPEEDY === 'true', // Set as true to disable CSSOM for Yandex Webvisor
      'process.env.APP_VERSION': JSON.stringify(version),
    }),
  ],
});

export default webpackServerConfig;
