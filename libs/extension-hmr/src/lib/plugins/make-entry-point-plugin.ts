import fs from 'node:fs';
import path from 'node:path';
import type { PluginOption } from 'vite';

/**
 * make entry point file for content script cache busting
 */
export function makeEntryPointPlugin(): PluginOption {
  const cleanupTargets = new Set<string>();
  const isFirefox = process.env.__FIREFOX__ === 'true';

  return {
    name: 'make-entry-point-plugin',
    generateBundle(options, bundle) {
      const outputDir = options.dir;

      if (!outputDir) {
        throw new Error('Output directory not found');
      }

      if (!fs.existsSync(outputDir)) {
        console.log(`Output directory does not exist, creating: ${outputDir}`);
        fs.mkdirSync(outputDir, { recursive: true });
      }

      for (const module of Object.values(bundle)) {
        const fileName = path.basename(module.fileName);
        const newFileName = fileName.replace('.js', '_dev.js');
        switch (module.type) {
          case 'asset':
            if (fileName.endsWith('.map')) {
              cleanupTargets.add(path.resolve(outputDir, fileName));
              const originalFileName = fileName.replace('.map', '');
              const replacedSource = String(module.source).replaceAll(originalFileName, newFileName);

              module.source = '';
              fs.writeFileSync(path.resolve(outputDir, newFileName), replacedSource);
              break;
            }
            break;

          case 'chunk': {
            console.log("writing file to:" + path.resolve(outputDir, newFileName))
            fs.writeFileSync(path.resolve(outputDir, newFileName), module.code);

            if (isFirefox) {
              const contentDirectory = extractContentDir(outputDir);
              module.code = `import(browser.runtime.getURL("${contentDirectory}/${newFileName}"));`;
            } else {
              module.code = `import('./${newFileName}');`;
            }
            break;
          }
        }
      }
    },
    closeBundle() {
      cleanupTargets.forEach(target => {
        fs.unlinkSync(target);
      });
    },
  };
}

/**
 * Extract content directory from output directory for Firefox
 * @param outputDir
 */
function extractContentDir(outputDir: string) {
  const parts = outputDir.split(path.sep);
  const distIndex = parts.indexOf('dist');

  if (distIndex !== -1 && distIndex < parts.length - 1) {
    return parts.slice(distIndex + 1);
  }

  throw new Error('Output directory does not contain "dist"');
}