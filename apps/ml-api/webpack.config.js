const {NxWebpackPlugin} = require('@nx/webpack');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const {join} = require('path');

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
      outputHashing: process.env['NODE_ENV'] === 'production' ? 'all' : 'none',
      optimization: process.env['NODE_ENV'] === 'production',
      memoryLimit: 4056,
      watch: process.env['NODE_ENV'] !== 'production',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "apps/ml-api/src/app/data/email-templates",
          to: "./data/email-templates"
        },
        // {
        //   from: "model_files/*",
        //   to: "../../"
        // },
      ],
    }),
  ],
};
