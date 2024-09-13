import {resolve} from 'node:path';
import react from "@vitejs/plugin-react-swc";
import {nxViteTsPaths} from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import {dirname} from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(__filename);

export const rootDir = resolve(_dirname);
export const srcDir = resolve(rootDir, 'src');
export const publicDir = resolve(rootDir, 'public');
export const nodeModulesDir = resolve(rootDir, '../../node_modules');
export const modelsDir = resolve(rootDir, '../../model_files');
export const outDir = resolve(rootDir, '../../dist/apps/web-filter-extension');

const APP_ENV = process.env.APP_ENV || 'production'
let API_URL = process.env.API_URL
let PUBLIC_URL = process.env.PUBLIC_URL

const appEnvProd = APP_ENV === 'production';
const appEnvDev = !appEnvProd;

if (!PUBLIC_URL) {
  PUBLIC_URL = (appEnvProd) ? "https://app.safekids.ai" : "http://localhost:5200"
}

if (!API_URL) {
  API_URL = (appEnvProd) ? "https://api.safekids.ai" : "http://localhost:3000";
}

const WATCHDOG_EXTENSION_ID = "oakeaedpheedicjddocfgpkpjlaocfhf";

export function withCommonConfig() {
  return {
    resolve: {
      alias: {
        '@root': rootDir,
        '@src': srcDir,
        '@public': publicDir,
        '@shared': resolve(srcDir, 'shared'),
        // '@content': resolve(srcDir, 'content'),
        // '@pages/popup': resolve(srcDir, 'pages', 'popup'),
        // '@pages/ui-prr': resolve(srcDir, 'pages', 'ui-prr'),
        // '@pages/ui-onboarding': resolve(srcDir, 'pages', 'ui-onboarding'),
        //'@assets': resolve(srcDir, 'assets'),
      },
    },
    define: {
      'import.meta.env.WATCHDOG_EXTENSION_ID': JSON.stringify(WATCHDOG_EXTENSION_ID),
      'import.meta.env.PUBLIC_URL': JSON.stringify(PUBLIC_URL),
      'import.meta.env.API_URL': JSON.stringify(API_URL),
    },
    plugins: [
      react(),
      nxViteTsPaths()
    ],
    publicDir: publicDir,
  }
}
