import {ConsoleLogger} from '@shared/logging/ConsoleLogger';
import {TestUtils} from 'apps/web-filter-extension-old/test-utils/helpers/TestUtils';
import {QueueWrapper} from 'apps/web-filter-extension/shared/queue/QueueWrapper';
import {EventHandlerInitializer} from './EventHandlerInitializer';
import {ChromeHelperFactory} from '@shared/chrome/factory/ChromeHelperFactory';
import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';
import {ContentFilterManager} from '../filter/ContentFilterManager';
import {PrrReportManager} from '../prr/PrrReportManager';
import {PrrMonitor, UrlPrrMonitor} from '../prr/monitor/PrrMonitor';
import {mock} from 'ts-mockito';
import {InformEventHandler} from '../event/handler/InformEventHandler';
import {EventType} from '@shared/types/message_types';
import {UserServiceImpl} from '../services/UserService';
import {ChromeCommonUtils} from '@shared/chrome/utils/ChromeCommonUtils';
import {MLPrrMonitor} from '../prr/monitor/MLPrrMonitor';

describe('EventHandlerModelsInitializer', () => {
  let instance: EventHandlerInitializer;
  const logger = new ConsoleLogger();
  const store = TestUtils.buildSettingsState();
  const localStorage = new LocalStorageManager();
  const queue = mock(QueueWrapper);
  const filterManager = mock(ContentFilterManager);
  const prrReportManager = mock(PrrReportManager);
  const urlPrrMonitor = mock(UrlPrrMonitor);
  const mlPrrMonitor = mock(MLPrrMonitor);
  const tabVisitManager = mock(InformEventHandler);
  let chromeHelperFactory = new ChromeHelperFactory(logger, localStorage, store);
  const chromeUtils = chromeHelperFactory.getChromeUtils();
  beforeEach(() => {
    const userService = mock(UserServiceImpl);
    let chromeHelperFactory = new ChromeHelperFactory(logger, localStorage, store);
    instance = new EventHandlerInitializer(
      store,
      logger,
      queue,
      filterManager,
      prrReportManager,
      urlPrrMonitor,
      mlPrrMonitor,
      chromeHelperFactory,
      tabVisitManager,
      userService
    );
  });

  it('instance should be an instanceof EventHandlerInitializer', async () => {
    // @ts-ignore
    global.chrome = {
      tabs: {
        // @ts-ignore
        onCreated: {
          addListener: jest.fn(() => Promise.resolve()),
        },
        // @ts-ignore
        onRemoved: {
          addListener: jest.fn(() => Promise.resolve()),
        },
        // @ts-ignore
        onUpdated: {
          addListener: jest.fn(() => Promise.resolve()),
        },
        // @ts-ignore
        onActivated: {
          addListener: jest.fn(() => Promise.resolve()),
        },
        // @ts-ignore
        onConnect: {
          addListener: jest.fn(() => Promise.resolve()),
        },
      },
      management: {
        // @ts-ignore
        onDisabled: {
          addListener: jest.fn(() => Promise.resolve()),
        },
        // @ts-ignore
        onEnabled: {
          addListener: jest.fn(() => Promise.resolve()),
        },
        // @ts-ignore
        onUninstalled: {
          addListener: jest.fn(() => Promise.resolve()),
        },
      },
      runtime: {
        // @ts-ignore
        onConnect: {
          addListener: jest.fn(() => Promise.resolve()),
        },
        // @ts-ignore
        onMessageExternal: {
          addListener: jest.fn(() => Promise.resolve()),
        },
        sendMessage: jest.fn(() => Promise.resolve()),
        setUninstallURL: jest.fn(() => Promise.resolve()),
      },
      storage: {
        // @ts-ignore
        local: {
          get: jest.fn(() => Promise.resolve()),
        },
      },
    };
    jest.spyOn(ChromeCommonUtils, 'getUserCredentials').mockResolvedValue({accessCode: '1111'});
    jest.spyOn(ChromeCommonUtils, 'getJWTToken').mockResolvedValue('524352346324634735734587');

    const result = await instance.init();

    expect(instance instanceof EventHandlerInitializer).toBeTruthy();
    expect(result).toBeTruthy();
  });

  it('should send an accessCode', async () => {
    const spy = jest.spyOn(chrome.runtime, 'sendMessage');
    instance.sendAccessCode('a', 'b', 'c');
    expect(spy).toBeCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a', {
      status: EventType.UPDATE_CREDENTIALS,
      accessCode: 'b',
      jwtToken: 'c'
    }, expect.any(Function));
  });
  it('should send an accessCode', async () => {
    const spy = jest.spyOn(chrome.runtime, 'sendMessage');
    instance.sendAccessCodeAfterUpdate('a', 'b', 'c');
    expect(spy).toBeCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('a', {
      status: EventType.UPDATE_CREDENTIALS_AFTER_UPDATE,
      accessCode: 'b',
      jwtToken: 'c'
    }, expect.any(Function));
  });
});
