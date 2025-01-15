// import fs from 'node:fs';
import deepmerge from 'deepmerge';
//
//const packageJson = JSON.parse(fs.readFileSync('../../package.json', 'utf8'));

const isFirefox = process.env.__FIREFOX__ === 'true';
const sidePanelConfig = false;
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
    // default_locale: 'en',
    author: 'Abbas Valliani',
    key: 'pnaedlhkmadjdgjkenjmaepfaiiioocc',
    name: 'Safe Kids AI for Email',
    description: 'Safe Kids AI Extension Monitors Email for Toxic Language!',
    version: '0.0.0',
    permissions: ['scripting', 'tabs', 'storage', 'identity', 'identity.email'],
    host_permissions: ['https://mail.google.com/*'],
    icons: {
      16: 'icon16.png',
      32: 'icon32.png',
      48: 'icon64.png',
      128: 'icon128.png',
    },
    background: {
      service_worker: 'background.iife.js',
      type: 'module',
    },
    content_scripts: [
      {
        matches: ['https://mail.google.com/mail/*'],
        css: ['content/html/prr.css'],
        js: ['content/index.iife.js'],
        run_at: 'document_end',
      },
    ],
    web_accessible_resources: [
      {
        resources: [
          '*.js',
          '*.css',
          '*.svg',
          '*.png',
          'models/*',
          'pages/*/*.html',
          'content/html/*',
          '*/.json',
        ],
        matches: [
          'https://mail.google.com/*',
          'https://fonts.googleapis.com/*',
        ],
      },
    ],
    content_security_policy: {
      extension_pages:
        "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'; ",
      sandbox: 'sandbox allow-scripts;',
    },
    sandbox: {
      pages: ['models/*', 'background.iife.js'],
    },
  },
  !isFirefox && sidePanelConfig,
);

export default manifest;
