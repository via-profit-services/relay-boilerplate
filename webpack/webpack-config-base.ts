import path from 'path';
import { Configuration, DefinePlugin } from 'webpack';

import packageInfo from '../package.json';

const srcDir = path.resolve(__dirname, '../src');
const assetsDir = path.resolve(__dirname, '../assets');

const webpackBaseConfig: Configuration = {
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        include: srcDir,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: process.env.NODE_ENV === 'development' ? ['react-refresh/babel'] : [],
            },
          },
          'shebang-loader',
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[contenthash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        include: [srcDir, assetsDir],
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
              noquotes: true,
              name: 'svg/[name].[contenthash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(jpg|png|gif)$/,
        include: [srcDir, assetsDir],
        use: [
          {
            loader: 'url-loader',
            options: {
              // Inline files smaller than 10 kB
              limit: 10 * 1024,
              name: 'images/assets/[name].[contenthash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
        include: [srcDir, assetsDir],
      },
      {
        test: /\.(mp4|webm)$/,
        include: [srcDir, assetsDir],
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'video/[name].[contenthash].[ext]',
          },
        },
      },
      {
        test: /\.md$/,
        include: [srcDir, assetsDir],
        use: [
          {
            loader: 'raw-loader',
            options: {
              name: 'markdown/[name].[chunkhash].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Do not inject «GRAPHQL_ENDPOINT» variables with the «DefinePlugin» plugin.
    // In this case, if you change «GRAPHQL_ENDPOINT», you will have to rebuild
    // the application again.
    new DefinePlugin({
      // Variable for compare the current app version and app in browser cache
      'process.env.WEBPACK_INJECT_APP_VERSION': JSON.stringify(packageInfo.version),
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    mainFields: ['browser', 'jsnext:main', 'main'],
    alias: {
      '~': path.resolve(__dirname, '..', 'src'),
    },
  },
};

export default webpackBaseConfig;
