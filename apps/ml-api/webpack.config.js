const {NxWebpackPlugin} = require('@nx/webpack');
const {join} = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/ml-api'),
  },
  plugins: [
    new NxWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ["./src/assets"],
      optimization: false,
      outputHashing: 'none',
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 4056,
      },
    }),
  ],
};
