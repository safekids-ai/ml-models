import { CopyAssetsExecutorSchema } from './schema';
import * as fs from 'fs-extra';


export default async function runExecutor(options: CopyAssetsExecutorSchema) {
  console.log('Executor ran for CopyAssets', options);
  try {
    await fs.copy(options.source, options.destination);
    console.log(`Assets have been copied from ${options.source} to ${options.destination}`);
    return { success: true };
  } catch (err) {
    console.error('Error during assets copying:', err);
    return { success: false };
  }
}
