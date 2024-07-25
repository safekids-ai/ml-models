import { ConsoleLogger } from '../../../../src/shared/logging/ConsoleLogger';
import { ChromeHelperFactory } from '../../../../src/shared/chrome/factory/ChromeHelperFactory';
import { LocalStorageManager } from '../../../../src/shared/chrome/storage/ChromeStorageManager';
import { TestUtils } from '../../../../TestUtils';
import { ChromeTabHelper } from '../../../../src/shared/chrome/tabs/ChromeTabHelper';
import { ChromeUtils } from '../../../../src/shared/chrome/utils/ChromeUtils';
import { PrrReports } from '../../../../src/shared/prr/PrrReports';

describe('ChromeHelperFactory Test', () => {
    let service: ChromeHelperFactory;
    const logger = new ConsoleLogger();
    const localStorageManager = new LocalStorageManager();
    const store = TestUtils.buildSettingsState();
    beforeEach(() => {
        service = new ChromeHelperFactory(logger, localStorageManager, store);
    });

    it('Should return ChromeTabHelper', async () => {
        const tabHelper = service.getTabHelper();
        expect(tabHelper instanceof ChromeTabHelper).toBeTruthy();
    });

    it('Should return ChromeUtils', async () => {
        const utils = service.getChromeUtils();
        expect(utils instanceof ChromeUtils).toBeTruthy();
    });

    it('Should return PrrReports', async () => {
        const prrReports = service.getPrrReports();
        expect(prrReports instanceof PrrReports).toBeTruthy();
    });

    it('Should return LocalStorageManager', async () => {
        const storageManager = service.getLocalStorage();
        expect(storageManager instanceof LocalStorageManager).toBeTruthy();
    });
});
