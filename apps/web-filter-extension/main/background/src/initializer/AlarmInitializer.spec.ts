import {mock} from 'ts-mockito';
import {ConsoleLogger} from '@shared/logging/ConsoleLogger';
import {Initializer} from './Initializer';
import {AlarmInitializer} from './AlarmInitializer';
import {ChromeHelperFactory} from '@shared/chrome/factory/ChromeHelperFactory';
import {TestUtils} from 'apps/web-filter-extension-old/test-utils/helpers/TestUtils';
import {ChromeAlarmUtil} from '@shared/chrome/alarm/ChromeAlarmUtil';
import {ConfigurationServiceImpl} from '../services/ConfigurationService';
import {TabVisit, InformEventHandler} from '../event/handler/InformEventHandler';

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

  beforeEach(() => {
  });

  it('should create instance of AlarmInitializer ', async () => {
    jest.spyOn(ChromeAlarmUtil, 'create').mockImplementation(() => {
    });
    instance = new AlarmInitializer(logger, store, configurationService, chromeHelperFactory, tabVisitManager);

    const result = await instance.init();
    expect(result).toBeTruthy();
  });

  it('should handle onAlarm event ', async () => {
    jest.spyOn(ChromeAlarmUtil, 'create').mockImplementation(() => {
    });
    instance = new AlarmInitializer(logger, store, configurationService, chromeHelperFactory, tabVisitManager);

    const result = await instance.init();
    expect(result).toBeTruthy();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });
});
