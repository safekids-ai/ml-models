const { composePlugins, withNx } = require('@nx/webpack');
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

const ROOT_DIR = path.join(__dirname, "../../../../")

const PATHS = {
  images_dir: path.join(ROOT_DIR, "assets/images"),
  public_dir: path.join(__dirname, "../../public"),
  dist: path.join(ROOT_DIR, "dist/apps/gmail-extension"),
  node_modules: path.join(ROOT_DIR, "node_modules")
};

// Nx plugins for webpack.
module.exports = composePlugins(
  withNx(),
  (config) => {
    // Update the webpack config as needed here.
    // e.g. `config.plugins.push(new MyPlugin())`
    config.optimization.runtimeChunk = false;
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {from: "src/assets", to: `${PATHS.dist}/public/html`},
          {from: PATHS.images_dir, to: `${PATHS.dist}/public/images`},
          {
            from: `${PATHS.node_modules}/@inboxsdk/core/pageWorld.js`,
            to: PATHS.dist
          }
        ]
      }));

    return config;
  }
);
