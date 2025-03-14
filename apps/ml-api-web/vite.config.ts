/// <reference types='vitest' />
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {nxViteTsPaths} from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as process from "process";
import path from "path";

const port: number = (process.env.PORT) ? parseInt(process.env.PORT) : 5200;
const portPreview: number = (process.env.PORT_PREVIEW) ? parseInt(process.env.PORT_PREVIEW) : 5300;

const APP_ENV = process.env.APP_ENV || 'production'
let API_URL = process.env.API_URL
let PUBLIC_URL = process.env.PUBLIC_URL
let NODE_ENV = process.env.NODE_ENV
let REACT_APP_SENTRY_RELEASE = process.env.REACT_APP_SENTRY_RELEASE
let REACT_APP_STRIPE_KEY = process.env.REACT_APP_STRIPE_KEY

if (!PUBLIC_URL) {
  PUBLIC_URL = (APP_ENV === 'production') ? "https://app.safekids.ai" : "http://localhost:5200"
}

if (!API_URL) {
  API_URL = (APP_ENV === 'production') ? "https://api.safekids.ai" : "http://localhost:3000";
}

console.log(`VITE starting on port:${port} and preview port: ${portPreview} APP_ENV:${APP_ENV} NODE_ENV:${NODE_ENV}`);

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/ml-api-web',
  define: {
    'import.meta.env.API_URL': JSON.stringify(API_URL),
    'import.meta.env.APP_ENV': JSON.stringify(APP_ENV),
    'import.meta.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL),
    'import.meta.env.REACT_APP_SENTRY_RELEASE': JSON.stringify(REACT_APP_SENTRY_RELEASE),
    'import.meta.env.REACT_APP_STRIPE_KEY': JSON.stringify(REACT_APP_STRIPE_KEY)
  },

  server: {
    port: port,
    host: true,
  },

  preview: {
    port: portPreview,
    host: true,
  },
  build: {
    sourcemap: true,
  },
  plugins:
    [
      react(),
      nxViteTsPaths(),
    ],
});
