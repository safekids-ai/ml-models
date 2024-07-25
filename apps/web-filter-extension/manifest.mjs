import packageJson from './project.json' assert { type: 'json' };

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = {
  manifest_version: 3,
  author: "Abbas Valliani",
  key: "safekidsaiathomeabcdefghijklmnop",
  name: "Safe Kids AI at Home",
  description: "Chrome Extension to make browsing safe for the kids!",
  version: "0.0.0",
  permissions: ["management", "scripting", "storage", "tabs", "system.cpu", "alarms"],
  host_permissions: ["https://*/*", "http://*/*"],
  background: {
    service_worker: 'src/pages/background/index.js',
    type: 'module',
  },
  content_scripts: [
    {
      matches: ['http://*/*', 'https://*/*', '<all_urls>'],
      js: [
        'src/pages/content/index.js',
        'script/jquery-3.6.0.min.js'
      ],
      // KEY for cache invalidation
      //css: ['assets/css/contentStyle<KEY>.chunk.css'],
    }
  ],
  action: {
    default_popup: 'src/pages/popup/index.html',
    default_icon: {
      16: "icon16.png",
      32: "icon32.png",
      48: "icon64.png",
      128: "icon128.png"
    },
  },
  icons: {
    16: "icon16.png",
    32: "icon32.png",
    48: "icon64.png",
    128: "icon128.png",
  },
  web_accessible_resources: [
    // {
    //   matches: ["<all_urls>"],
    //   resources: ["src/pages/content/index.js"]
    // },
    {
      resources: ['assets/js/*.js', 'assets/css/*.css', 'icon*.png'],
      matches: ['*://*/*'],
    },
    {
      resources: ["models/*"],
      matches: ["<all_urls>"]
    },
    {
      resources: ["src/assets/img/*"],
      matches: ["<all_urls>"],
      use_dynamic_url: true
    },
    {
      resources: ["*/prr.html*"],
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
      "src/pages/background/models/*",
      "src/pages/background/index.js"]
  },
  cross_origin_embedder_policy: {
    "value": "require-corp"
  },
  cross_origin_opener_policy: {
    "value": "same-origin"
  },
};

export default manifest;
