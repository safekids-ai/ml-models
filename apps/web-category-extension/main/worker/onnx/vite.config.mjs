import {ROOT_DIR, MAIN_DIR, OUT_DIR, withCommonConfig} from '../../../withCommonConfig.mjs';
import path, {resolve} from 'node:path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

import {withPageConfig} from '../../../../../dist/libs/extension-vite-config';
import deepmerge from "deepmerge";

const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(__filename);

const outDir = resolve(OUT_DIR, 'worker', 'onnx')
const srcDir = resolve(MAIN_DIR, 'worker', 'onnx', 'src')

export default withPageConfig({
  ...deepmerge(
    withCommonConfig(),
    {
      root: resolve(_dirname),
      resolve: {
        alias: {
          '@src': srcDir,
        },
      },
      build: {
        rollupOptions: {
          external: ['chrome', /\.wasm$/],
          input: {
            worker: resolve(srcDir, 'worker.ts')
          },
          output: {
            format: 'es',
            entryFileNames: '[name].js',
          },
        }
      },
      assetsInclude: ["**/*.wasm"],
      outDir: resolve(_dirname, "..", "..","dist"),
      publicDir: resolve(_dirname, 'public'),
    })
});
