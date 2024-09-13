import fs from 'node:fs';
import deepmerge from 'deepmerge';

const packageJson = JSON.parse(fs.readFileSync('../../package.json', 'utf8'));

const isFirefox = process.env.__FIREFOX__ === 'true';

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
    default_locale: 'en',
    /**
     * if you want to support multiple languages, you can use the following reference
     * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
     */
    author: "Abbas Valliani",
    key: "safekidsaiathomeabcdefghijklmnop",
    name: "Safe Kids AI at Home",
    description: "Chrome Extension to make browsing safe for the kids!",
    version: "0.0.0",
    // name: '__MSG_extensionName__',
    // version: packageJson.version,
    // description: '__MSG_extensionDescription__',
    permissions: ["management", "scripting", "storage", "tabs", "system.cpu", "alarms"],
    host_permissions: ["https://*/*", "http://*/*"],
    // options_page: 'options/index.html',
    background: {
      service_worker: 'background.iife.js',
      type: 'module',
    },
    // action: {
    //   default_popup: 'popup/index.html',
    //   default_icon: {
    //     16: "icon16.png",
    //     32: "icon32.png",
    //     48: "icon64.png",
    //     128: "icon128.png"
    //   },
    // },
    icons: {
      16: "icon16.png",
      32: "icon32.png",
      48: "icon64.png",
      128: "icon128.png",
    },
    // content_scripts: [
    //   {
    //     matches: ['http://*/*', 'https://*/*', '<all_urls>'],
    //     js: ['content/index.iife.js', 'jquery-3.6.0.min.js'],
    //   },
    //   // {
    //   //   matches: ['http://*/*', 'https://*/*', '<all_urls>'],
    //   //   css: ['content.css'], // public folder
    //   // },
    // ],
    // devtools_page: 'devtools/index.html',
    web_accessible_resources: [
      {
        resources: ['*.js', '*.css', '*.svg', 'icon-128.png', 'icon-34.png'],
        matches: ['*://*/*'],
      },
      {

      }
    ],
  },
  !isFirefox && sidePanelConfig,
);

export default manifest;
