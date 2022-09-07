/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

let config = {
  context: path.join(__dirname, '/src'),
  entry: `index.ts`,
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    clean: true,
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebPackPlugin({
      template: './index.html',
      filename: './index.html',
      base: '/',
    }),
  ],
  //
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: ['./', 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: [{loader: 'ts-loader'}],
      },
      {
        test: /\.css$/,
        use: [
          {loader: MiniCssExtractPlugin.loader, options: {}},
          {loader: 'css-loader', options: {url: true, import: true/*, modules: true*/}},
        ],
      },
    ],
  },
};

if (process.env.NODE_ENV === 'development') {
  config.devtool = 'inline-source-map';
  config.devServer = {
    static: path.join(__dirname, 'dist'),
    port: 8010,
    historyApiFallback: true,
  };
}

module.exports = config;
