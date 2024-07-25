import typescript from '@rollup/plugin-typescript';

const plugins = [typescript()];

export default [
  {
    plugins,
    input: 'tools/extension/reload/initReloadServer.mts',
    output: {
      file: 'tools/extension/reload/initReloadServer.mjs',
    },
    external: ['ws', 'chokidar', 'timers'],
  },
  {
    plugins,
    input: 'tools/extension/reload/injections/script.ts',
    output: {
      file: 'tools/extension/reload/injections/script.js',
    },
  },
  {
    plugins,
    input: 'tools/extension/reload/injections/view.ts',
    output: {
      file: 'tools/extension/reload/injections/view.js',
    },
  },
];
