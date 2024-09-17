import { ConsoleLogger } from '../../logging/ConsoleLogger';
import { ChromeHelperFactory } from './ChromeHelperFactory';
import { LocalStorageManager } from '../storage/ChromeStorageManager';
import { TestUtils } from '../../../../TestUtils';
import { ChromeTabHelper } from '../tabs/ChromeTabHelper';
import { ChromeUtils } from '../utils/ChromeUtils';
import { PrrReports } from '../../prr/PrrReports';

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
