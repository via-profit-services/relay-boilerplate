import dotenv from 'dotenv';
import fs from 'fs-extra';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';
import { Configuration, Compiler } from 'webpack';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';
import CompressionPlugin from 'compression-webpack-plugin';

import webpackBaseConfig from './webpack-config-base';

dotenv.config();

const templateSource = path.resolve(__dirname, '../assets/template.html');
const templateContent = fs.readFileSync(templateSource, { encoding: 'utf8' });

const webpackProdConfig: Configuration = merge(webpackBaseConfig, {
  mode: 'production',
  entry: ['@babel/polyfill', path.resolve(__dirname, '../src/app.tsx')],
  output: {
    path: path.join(__dirname, '../dist/public/'),
    filename: 'js/bundle.[contenthash].js',
    publicPath: '/public/',
    chunkFilename: 'js/chunk.[contenthash].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      templateContent,
      filename: '../public/index.html',
    }),
    new CompressionPlugin({
      filename: '[path][base].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: process.env.ANALYZE ? 'server' : 'disabled',
      openAnalyzer: true,
    }),
    {
      // Just copy the robots.txt file
      apply: (compiler: Compiler) => {
        compiler.hooks.afterEmit.tapAsync('WebpackAfterBuild', (_, callback) => {
          fs.copySync(
            path.resolve(__dirname, '../assets/robots.txt'),
            path.resolve(__dirname, '../dist/robots.txt'),
          );

          callback();
        });
      },
    },
  ],
});

export default webpackProdConfig;
