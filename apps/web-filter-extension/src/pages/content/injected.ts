
import { LocalStorageManager } from '@src/shared/chrome/storage/ChromeStorageManager';
import { ChromeUtils } from '@src/shared/chrome/utils/ChromeUtils';
import { ConsoleLogger, Logger } from '@src/shared/logging/ConsoleLogger';
import { ChromeStore } from '@src/pages/popup/redux/chrome-storage';
import { ContentBootstrapper } from '@src/pages/content/bootstrap/Bootstrapper';
import { ChromeCommonUtils } from '@src/shared/chrome/utils/ChromeCommonUtils';
//import refreshOnUpdate from 'virtual:reload-on-update-in-view';
// //refreshOnUpdate('pages/content');
//
export const init = async (): Promise<void> => {
    ChromeCommonUtils.wakeup();

    const store = await ChromeStore.createStore();
    if (store == null) {
        throw new Error('store not initialized');
    }
    const { logging } = store.getState().settings;

    const logger: Logger = new ConsoleLogger();
    if (!logging) {
        logger.disable();
        logger.disableDebug();
    }
    chrome.runtime.connect().onDisconnect.addListener(function () {
        // clean up when content script gets disconnected
        logger.log('***** THE BROWSER DISCONNECTED');
    });

    ChromeCommonUtils.wakeup();

    const localStorageManager = new LocalStorageManager();
    const chromeUtils = new ChromeUtils(logger, localStorageManager);

    const bootstrapper = new ContentBootstrapper(store, logger, localStorageManager, chromeUtils);

    bootstrapper.init().catch((e) => {
        /* istanbul ignore next */
        throw new Error(`Bootstrapper init failure. ${JSON.stringify(e)}`);
    });
    logger.log("Content script is loaded")
};

init().catch((e) => ChromeCommonUtils.getLogger().error);
