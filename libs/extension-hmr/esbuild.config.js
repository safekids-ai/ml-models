const esbuild = require('esbuild');

// Build reload.ts into IIFE format
esbuild.build({
  entryPoints: ['libs/extension-hmr/src/lib/injections/reload.ts'],
  bundle: true,
  format: 'iife',  // Immediately Invoked Function Expression
  outfile: 'dist/libs/extension-hmr/build/injections/reload.js',
  target: ['es2015'],
  logLevel: 'info',
}).catch(() => process.exit(1));

// Build refresh.ts into IIFE format
esbuild.build({
  entryPoints: ['libs/extension-hmr/src/lib/injections/refresh.ts'],
  bundle: true,
  format: 'iife',  // Immediately Invoked Function Expression
  outfile: 'dist/libs/extension-hmr/build/injections/refresh.js',
  target: ['es2015'],
  logLevel: 'info',
}).catch(() => process.exit(1));
