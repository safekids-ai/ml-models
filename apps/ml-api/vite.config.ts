import {ConfigEnv, defineConfig, loadEnv} from 'vite';
import {VitePluginNode} from 'vite-plugin-node';
import {nxViteTsPaths} from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(({command, mode}: ConfigEnv) => {
  return {
    server: {
      // vite server configs, for details see [vite doc](https://vitejs.dev/config/#server-host)
      port: 3000,
      hmr: true
    },
    build: {
      target: 'es2020',
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    },
    plugins: [
      nxViteTsPaths(),
      ...VitePluginNode({
        adapter: 'nest',
        appPath: './src/app/main.ts',
        tsCompiler: "swc",
        initAppOnBoot: true,
      }),
    ],
    optimizeDeps: {
      esbuildOptions: {
        tsconfigRaw: {
          compilerOptions: {
            experimentalDecorators: true,
            emitDecoratorMetadata: true,
          }
        }
      },
      exclude: [
        '@nestjs/microservices',
        '@nestjs/websockets',
        'cache-manager',
        'class-transformer',
        'class-validator',
        'fastify-swagger',
        'mock-aws-s3',
        'nock',
        '@mapbox/node-pre-gyp'
      ],
    },
  };
});
