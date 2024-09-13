import {defineConfig} from 'vite';
import {modelsDir, nodeModulesDir, withCommonConfig} from './withCommonConfig.mjs';
import {resolve} from 'node:path';
import deepmerge from 'deepmerge';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {viteStaticCopy} from "vite-plugin-static-copy";
import {watchRebuildPlugin} from "../../dist/libs/extension-hmr/index.cjs";
import {isDev, isProduction, watchOption} from '../../dist/libs/extension-vite-config/index.cjs';

const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(__filename);

const outDir = resolve(_dirname, '../../dist/apps/web-filter-extension/background');

export default defineConfig({
  ...deepmerge(
    withCommonConfig(),
    {
      plugins: [
        viteStaticCopy({
          targets: [
            {
              src: `${nodeModulesDir}/onnxruntime-web/dist/*.wasm`,
              dest: `${outDir}/`,
            },
            {
              src: `${modelsDir}/*`,
              dest: `${outDir}/models`,
            },
          ],
        }),
        isDev && watchRebuildPlugin({reload: true}),
      ]
    }),
  build: {
    lib: {
      formats: ['iife'],
      entry: resolve(_dirname, 'src/background/index.ts'),
      name: 'BackgroundScript',
      fileName: 'background',
    },
    outDir,
    emptyOutDir: false,
    sourcemap: isDev,
    minify: isProduction,
    reportCompressedSize: isProduction,
    watch: watchOption,
    rollupOptions: {
      external: ['chrome'],
    }
  }
})
;
