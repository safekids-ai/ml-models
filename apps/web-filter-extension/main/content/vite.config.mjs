import {MAIN_DIR, OUT_DIR, withCommonConfig} from '../../withCommonConfig.mjs';
import {resolve} from 'node:path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {makeEntryPointPlugin} from "../../../../dist/libs/extension-hmr";
import {isDev, withPageConfig} from '../../../../dist/libs/extension-vite-config';
import deepmerge from "deepmerge";

const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(__filename);

const outDir = resolve(OUT_DIR, 'content');

export default withPageConfig({
  ...deepmerge(
    withCommonConfig(), {
      resolve: {
        alias: {
          '@src': resolve(MAIN_DIR, 'content', 'src'),
        },
      },
      plugins: [isDev && makeEntryPointPlugin()],
      build: {
        lib: {
          entry: resolve(_dirname, 'src/index.ts'),
          formats: ['iife'],
          name: 'ContentScript',
          fileName: 'index',
        },
        outDir: outDir,
      },
      publicDir: resolve(_dirname, 'public'),
    })
});
