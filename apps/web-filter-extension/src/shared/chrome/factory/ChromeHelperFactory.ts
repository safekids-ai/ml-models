import {PrrReports} from "@src/shared/prr/PrrReports";
import { Logger } from '@src/shared/logging/ConsoleLogger';
import { ReduxStorage } from '@src/shared/types/ReduxedStorage.type';
import { ChromeStorageManager, LocalStorageManager } from '@src/shared/chrome/storage/ChromeStorageManager';
import { ChromeTabHelper } from '@src/shared/chrome/tabs/ChromeTabHelper';
import { ChromeUtils } from '@src/shared/chrome/utils/ChromeUtils';

/**
 * Factory class to provide instances of chrome helpers
 */
export class ChromeHelperFactory {
    private readonly tabHelper: ChromeTabHelper;
    private readonly chromeUtils: ChromeUtils;
    private readonly prrReports: PrrReports;

    constructor(private readonly logger: Logger, private readonly localStorageManager: ChromeStorageManager, private readonly store: ReduxStorage) {
        this.tabHelper = new ChromeTabHelper(this.logger, this.store);
        this.chromeUtils = new ChromeUtils(this.logger, this.localStorageManager);
        this.prrReports = new PrrReports();
    }

    getTabHelper = (): ChromeTabHelper => {
        return this.tabHelper;
    };

    getChromeUtils() {
        return this.chromeUtils;
    }

    getPrrReports() {
        return this.prrReports;
    }

    getLocalStorage(): LocalStorageManager {
        return new LocalStorageManager();
    }
}
