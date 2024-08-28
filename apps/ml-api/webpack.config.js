const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const {join} = require('path');

module.exports = {
  watch: process.env['APP_ENV'] !== 'production',
  output: {
    path: join(__dirname, '../../dist/apps/ml-api'),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ["./src/assets"],
      memoryLimit: 4056,
      outputHashing: process.env['APP_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['APP_ENV'] === 'production'
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "apps/ml-api/src/app/data/email-templates",
          to: "./data/email-templates"
        },
      ],
    }),
  ]
};
