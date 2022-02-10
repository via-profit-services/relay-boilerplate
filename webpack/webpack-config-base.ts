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
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'public/fonts/[contenthash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(svg|gif)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'public/images/[contenthash].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|webp)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              minimizer: {
                implementation: ImageMinimizerPlugin.imageminMinify,
                options: {
                  plugins: [
                    ['imagemin-webp', { quality: 25 }],
                    ['imagemin-mozjpeg', { quality: 25 }],
                    ['imagemin-pngquant', { quality: [0.6, 0.8] }],
                  ],
                },
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: 'html-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(mp4|webm)$/,
        exclude: /node_modules/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 0,
            name: 'public/video/[contenthash].[ext]',
          },
        },
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
