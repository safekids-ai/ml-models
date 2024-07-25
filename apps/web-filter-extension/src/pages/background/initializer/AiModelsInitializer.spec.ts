import { Initializer } from '../../../../src/pages/background/initializer/Initializer';
import { AiModelsInitializer } from '../../../../src/pages/background/initializer/AiModelsInitializer';
import { ConsoleLogger } from '../../../../src/shared/logging/ConsoleLogger';
import { TestUtils } from 'apps/web-filter-extension/test-utils/helpers/TestUtils';
import { QueueWrapper } from '../../../../src/pages/background/model/queue/QueueWrapper';
import { jest } from '@jest/globals';
import { QueueManager } from '../../../../src/pages/background/model/QueueManager';
import { BeanFactory } from '../../../../src/pages/background/factory/BeanFactory';
import { LocalStorageManager } from '../../../../src/shared/chrome/storage/ChromeStorageManager';

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
