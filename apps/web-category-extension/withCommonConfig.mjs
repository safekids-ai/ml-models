import {resolve} from 'node:path';
import react from "@vitejs/plugin-react-swc";
import {nxViteTsPaths} from "@nx/vite/plugins/nx-tsconfig-paths.plugin";
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
export const ROOT_DIR = dirname(filename);
//export const ROOT_DIR = resolve(process.cwd(), "apps", "web-category-extension")
export const MAIN_DIR = resolve(ROOT_DIR, 'main');
export const NODE_MODULES_DIR = resolve(ROOT_DIR, '../../node_modules');
export const MODELS_DIR = resolve(ROOT_DIR, '../../model_files');
export const OUT_DIR = resolve(ROOT_DIR, '../../dist/apps/web-category-extension');

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


export function withCommonConfig() {
  return {
    resolve: {
      alias: {
        '@shared': resolve(MAIN_DIR, 'shared', 'src'),
      },
    },
    plugins: [
      react(),
      nxViteTsPaths()
    ],
    envDir: resolve(__dirname, ".")
  }
}

export {API_URL, PUBLIC_URL}
