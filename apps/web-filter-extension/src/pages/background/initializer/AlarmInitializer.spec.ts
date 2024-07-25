import { mock } from 'ts-mockito';
import { ConsoleLogger } from '../../../../src/shared/logging/ConsoleLogger';
import { Initializer } from '../../../../src/pages/background/initializer/Initializer';
import { AlarmInitializer } from '../../../../src/pages/background/initializer/AlarmInitializer';
import { ChromeHelperFactory } from '../../../../src/shared/chrome/factory/ChromeHelperFactory';
import { TestUtils } from 'apps/web-filter-extension/test-utils/helpers/TestUtils';
import { ChromeAlarmUtil } from '../../../../src/shared/chrome/alarm/ChromeAlarmUtil';
import { ConfigurationServiceImpl } from '../../../../src/pages/background/services/ConfigurationService';
import { TabVisit, InformEventHandler } from '../../../../src/pages/background/event/handler/InformEventHandler';

describe('AlarmInitializer test', () => {
    let instance: Initializer;
    const logger = new ConsoleLogger();
    const store = TestUtils.buildSettingsState();
    const chromeHelperFactory = mock(ChromeHelperFactory);
    const configurationService = mock(ConfigurationServiceImpl);
    const tabVisitManager: InformEventHandler = mock<InformEventHandler>();
    global.chrome = {
        alarms: {
            // @ts-ignore
            onAlarm: {
                addListener: jest.fn(() => Promise.resolve()),
            },
        },
    };

    beforeEach(() => {});

    it('should create instance of AlarmInitializer ', async () => {
        jest.spyOn(ChromeAlarmUtil, 'create').mockImplementation(() => {});
        instance = new AlarmInitializer(logger, store, configurationService, chromeHelperFactory, tabVisitManager);

        const result = await instance.init();
        expect(result).toBeTruthy();
    });

    it('should handle onAlarm event ', async () => {
        jest.spyOn(ChromeAlarmUtil, 'create').mockImplementation(() => {});
        instance = new AlarmInitializer(logger, store, configurationService, chromeHelperFactory, tabVisitManager);

        const result = await instance.init();
        expect(result).toBeTruthy();
    });

    afterAll(() => {
        jest.clearAllMocks();
    });
});
