// import fs from 'node:fs';
import deepmerge from 'deepmerge';
//
//const packageJson = JSON.parse(fs.readFileSync('../../package.json', 'utf8'));

const isFirefox = process.env.__FIREFOX__ === 'true';
const sidePanelConfig = false
// const sidePanelConfig = {
//   side_panel: {
//     default_path: 'side-panel/index.html',
//   },
//   permissions: ['sidePanel'],
// };

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = deepmerge(
  {
    manifest_version: 3,
//    default_locale: 'en',
    author: "Abbas Valliani",
    key: "safekidsaiathomeabcdefghijklmnop",
    name: "Safe Kids Web Category Extension",
    description: "Chrome Extension to determine web category of the page!",
    version: "0.0.0",
    permissions: ["management", "scripting", "storage", "tabs", "system.cpu", "alarms"],
    host_permissions: ["https://*/*", "http://*/*"],
    icons: {
      16: "icon16.png",
      32: "icon32.png",
      48: "icon64.png",
      128: "icon128.png",
    },
    background: {
      service_worker: 'background.iife.js',
      type: 'module',
    },
    content_scripts: [
      {
        matches: ['http://*/*', 'https://*/*', '<all_urls>'],
        js: ['content/index.iife.js'],
      }
    ],
    web_accessible_resources: [
      {
        resources: ['*.js', '*.css', '*.svg', '*.png'],
        matches: ['*://*/*'],
      },
      {
        resources: ["worker/onnx/worker.js"],
        matches: ["<all_urls>"]
      },
      {
        resources: ["models/*"],
        matches: ["<all_urls>"]
      },
      {
        resources: ["pages/*/*.html"],
        matches: ["<all_urls>"]
      },
      {
        resources: ["*/.json"],
        matches: ["<all_urls>"]
      }
    ],
    content_security_policy: {
      extension_pages: "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'; ",
      sandbox: "sandbox allow-scripts;"
    },
    sandbox: {
      pages: [
        "models/*",
        "background.iife.js"]
    },
    cross_origin_embedder_policy: {
      "value": "require-corp"
    },
    cross_origin_opener_policy: {
      "value": "same-origin"
    },
  },
  !isFirefox && sidePanelConfig,
);

export default manifest;
