import {ConfigEnv, defineConfig, loadEnv} from 'vite';
import {VitePluginNode} from 'vite-plugin-node';
import {nxViteTsPaths} from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

export default defineConfig(({command, mode}: ConfigEnv) => {
  return {
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
      ],
    },
  };
});
