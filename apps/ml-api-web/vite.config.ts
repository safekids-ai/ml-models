/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import * as process from "process";
import fs from 'fs';
import * as path from "path";

const port:number = (process.env.PORT) ? parseInt(process.env.PORT) : 4200;
const portPreview:number = (process.env.PORT_PREVIEW) ? parseInt(process.env.PORT_PREVIEW) : 4300;

console.log(`VITE starting on port:${port} and preview port: ${portPreview}`);
export default defineConfig({
  cacheDir: '../../node_modules/.vite/ml-api-web',

  server: {
    port: port,
    host: true,
  },

  preview: {
    port: portPreview,
    host: true,
  },

  plugins:
    [
      react(),
      nxViteTsPaths(),
      {
        name: 'copy-custom-files',
        async buildStart(options) {
          const source = path.join(__dirname, "launch.ts");
          const target = path.join(__dirname, "launch2.ts");
          return fs.copyFile(source, target, (err) => {
            console.log("Unable to copy file due to", err);
          });
        },
      }
    ],

  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },

  test: {
    globals: true,
    cache: {
      dir: '../../node_modules/.vitest',
    },
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
  },
});
