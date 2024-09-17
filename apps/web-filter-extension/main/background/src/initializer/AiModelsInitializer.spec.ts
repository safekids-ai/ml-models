import {Initializer} from './Initializer';
import {AiModelsInitializer} from './AiModelsInitializer';
import {ConsoleLogger} from '@shared/logging/ConsoleLogger';
import {TestUtils} from 'apps/web-filter-extension-old/test-utils/helpers/TestUtils';
import {QueueWrapper} from 'apps/web-filter-extension/shared/queue/QueueWrapper';
import {jest} from '@jest/globals';
import {QueueManager} from '../model/QueueManager';
import {BeanFactory} from '../factory/BeanFactory';
import {LocalStorageManager} from '@shared/chrome/storage/ChromeStorageManager';

describe('AiModelsInitializer', () => {
  let instance: Initializer;
  const logger = new ConsoleLogger();
  const store = TestUtils.buildSettingsState();
  const storeManager = new LocalStorageManager();
  const beanFactory = new BeanFactory(store, storeManager, logger);
  const queueManager = new QueueManager(logger, store, beanFactory);
  const map = new Map();

  beforeEach(() => {
    instance = new AiModelsInitializer(queueManager);
  });

  it('instance should be an instanceof AiModelsInitializer', () => {
    const queueManagerCreateQueueMock = jest.spyOn(queueManager, 'createQueue').mockImplementation(async (): Promise<QueueWrapper> => {
      const queueWrapper = new QueueWrapper(map, logger, store);
      return Promise.resolve(queueWrapper);
    });

    expect(instance instanceof AiModelsInitializer).toBeTruthy();
    instance.init();
    expect(queueManagerCreateQueueMock).toBeCalled();
  });
});
