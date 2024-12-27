import * as process from 'process';
import {initReloadServer} from "../initializers/initReloadServer"

function main() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const isWatchMode = process.argv.includes('--watch');

  if (nodeEnv === 'development' && isWatchMode) {
    initReloadServer();
  }
}
main();
