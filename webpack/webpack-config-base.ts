import path from 'node:path';
import { Configuration, DefinePlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';

import packageInfo from '../package.json';

const webpackBaseConfig: Configuration = {
  target: 'web',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: [process.env.NODE_ENV === 'development' && 'react-refresh/babel'].filter(
                Boolean,
              ),
            },
          },
          'shebang-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|webp|mp4|webm|svg|gif|eot|otf|ttf|woff|woff2)$/,
        type: 'asset',
      },
      {
        test: /\.(png|jpg|jpeg|webp)$/,
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                  type: 'asset',
                  plugins: [
                    ['jpegtran', { progressive: true }],
                    ['mozjpeg', { quality: 90 }],
                    ['optipng', { optimizationLevel: 5 }],
                    ['pngquant', { quality: [0.6, 0.8] }],
                  ],
                },
              },
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
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.css'],
    mainFields: ['browser', 'jsnext:main', 'main'],
    alias: {
      '~': path.resolve(__dirname, '..', 'src'),
    },
  },
};

export default webpackBaseConfig;
