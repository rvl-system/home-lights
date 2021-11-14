/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: './src/index.tsx',
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new ESLintPlugin({
      context: './src'
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    symlinks: false
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '..', 'public')
  }
};
