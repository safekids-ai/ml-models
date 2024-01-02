const {composePlugins, withNx} = require('@nx/webpack');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
const webpack = require('webpack');

const ROOT_DIR = path.join(__dirname, "../../../../")

const PATHS = {
  model_dir: path.join(ROOT_DIR, "model_files"),
  dist: path.join(ROOT_DIR, "dist/apps/gmail-extension"),
  node_modules: path.join(ROOT_DIR, "node_modules")
};

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), (config) => {
  // Update the webpack config as needed here.
  // e.g. `config.plugins.push(new MyPlugin())`
  config.optimization.runtimeChunk = false;
  config.plugins.push(
    new CopyPlugin({
      patterns: [
        {from: PATHS.model_dir, to: `${PATHS.dist}/background/models`},
        {
          from: "*.wasm",
          to: `${PATHS.dist}/background`,
          context: `${PATHS.node_modules}/onnxruntime-web/dist`
        },
      ]
    })
  );
  config.plugins.push(new webpack.DefinePlugin({
    process: {env: {}}
  }))
  return config;
});
