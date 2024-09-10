/// <reference types="vitest" />
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path, {resolve} from 'path';
import makeManifest from '../../tools/extension/plugins/make-manifest';
import {nxViteTsPaths} from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import customDynamicImport from '../../tools/extension/plugins/custom-dynamic-import';
import addHmr from '../../tools/extension/plugins/add-hmr';
import watchRebuild from '../../tools/extension/plugins/watch-rebuild';
import {viteStaticCopy} from 'vite-plugin-static-copy'
import process from "process";

// import postcss from 'rollup-plugin-postcss';
// import {
//   createStyleImportPlugin,
//   AndDesignVueResolve,
//   VantResolve,
//   ElementPlusResolve,
//   NutuiResolve,
//   AntdResolve,
// } from 'vite-plugin-style-import'

const rootDir = resolve(__dirname);
const rootProjectDir = resolve(rootDir, "../..");
const nodeModulesDir = resolve(rootProjectDir, "node_modules");
const modelsDir = resolve(rootProjectDir, "model_files");
const manifestFile = resolve(rootDir, 'manifest.mjs');
const srcDir = resolve(rootDir, 'src');
const testUtilsDir = resolve(rootDir, 'test-utils', 'app');
const pagesDir = resolve(srcDir, 'pages');
const assetsDir = resolve(srcDir, 'assets');
const outDir = resolve(rootDir, '../../dist/apps/web-filter-extension');
const publicDir = resolve(rootDir, 'public');
const sharedDir = resolve(srcDir, 'shared');

const APP_ENV = process.env.APP_ENV || 'production'
let API_URL = process.env.API_URL
let PUBLIC_URL = process.env.PUBLIC_URL
let NODE_ENV = process.env.NODE_ENV

const isProduction = APP_ENV === 'production';
const isDev = !isProduction;

if (!PUBLIC_URL) {
  PUBLIC_URL = (isProduction) ? "https://app.safekids.ai" : "http://localhost:5200"
}

if (!API_URL) {
  API_URL = (isProduction) ? "https://api.safekids.ai" : "http://localhost:3000";
}

const WATCHDOG_EXTENSION_ID = "oakeaedpheedicjddocfgpkpjlaocfhf";

// ENABLE HMR IN BACKGROUND SCRIPT
const enableHmrInBackgroundScript = NODE_ENV != 'production';
const cacheInvalidationKeyRef = {current: generateKey()};

console.log(`Building consumer extension with PUBLIC_URL=${PUBLIC_URL} and API_URL=${API_URL} NODE_ENV=${NODE_ENV} ENABLED_HMR=${enableHmrInBackgroundScript}`)

export default defineConfig({
  resolve: {
    alias: {
      '@root': rootDir,
      '@src': srcDir,
      '@shared': sharedDir,
      '@assets': assetsDir,
      '@pages': pagesDir,
      '@public': publicDir,
      '@test-utils': testUtilsDir
    },
  },
  define: {
    'import.meta.env.WATCHDOG_EXTENSION_ID': JSON.stringify(WATCHDOG_EXTENSION_ID),
    'import.meta.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL),
    'import.meta.env.API_URL': JSON.stringify(API_URL),
  },
  plugins: [
    react(),
    nxViteTsPaths(),
    makeManifest({getCacheInvalidationKey}, outDir, manifestFile),
    customDynamicImport(),
    addHmr({background: enableHmrInBackgroundScript, view: true}),
    enableHmrInBackgroundScript && watchRebuild({afterWriteBundle: regenerateCacheInvalidationKey}),
    viteStaticCopy({
      targets: [
        {
          src: `${nodeModulesDir}/onnxruntime-web/dist/*.wasm`,
          dest: `${outDir}/src/pages/background`,
        },
        {
          src: `${modelsDir}/*`,
          dest: `${outDir}/src/pages/background/models`,
        },
        {
          src: `${sharedDir}/zvelo/data.json`,
          dest: `${outDir}/src/pages`,
        },
      ],
    }),
  ],
  publicDir,
  build: {
    outDir,
    /** Can slow down build speed. */
    sourcemap: isDev,
    minify: isProduction,
    modulePreload: false,
    reportCompressedSize: isProduction,
    emptyOutDir: !isDev,
    rollupOptions: {
      // plugins: [
      //   chromeExtension(),
      //   simpleReloader()
      // ],
      input: {
        background: resolve(pagesDir, 'background', 'index.ts'),
        popup: resolve(pagesDir, 'popup', 'index.html'),
        content: resolve(pagesDir, 'content', 'index.ts'),
        "ui-prr": resolve(pagesDir, 'ui-prr', 'index.html'),
        "ui-onboarding": resolve(pagesDir, 'ui-onboarding', 'index.html'),
      },
      output: {
        manualChunks: {},
        entryFileNames: 'src/pages/[name]/index.js',
        chunkFileNames: isDev ? 'assets/js/[name].js' : 'assets/js/[name].[hash].js',
        assetFileNames: assetInfo => {
          const {name} = path.parse(assetInfo.name);
          const assetFileName = name === 'contentStyle' ? `${name}${getCacheInvalidationKey()}` : name;
          return `assets/[ext]/${assetFileName}.chunk.[ext]`;
        },
      },
      plugins: []
    },
  },
  test: {
    globals: true,
    // cache: {
    //   dir: '../../node_modules/.vitest',
    // },
    environment: 'jsdom',
    reporters: ["default"],
//    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    includeSource: ['test-utils/app/*.ts'],
    include: ['src/**/Boot*.spec.ts'],
    setupFiles: './test-utils/vitest.setup.js',
  },
});

function getCacheInvalidationKey() {
  return cacheInvalidationKeyRef.current;
}

function regenerateCacheInvalidationKey() {
  cacheInvalidationKeyRef.current = generateKey();
  return cacheInvalidationKeyRef;
}

function generateKey(): string {
  return `${Date.now().toFixed()}`;
}
