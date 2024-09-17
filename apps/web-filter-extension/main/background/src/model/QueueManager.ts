import {Logger} from '@shared/logging/ConsoleLogger';
import {MLModel} from '@shared/types/MLModel.type';
import {ReduxStorage} from '@shared/types/ReduxedStorage.type';
import {AIModels, BeanFactory, BeanNames} from '../factory/BeanFactory';

import {QueueWrapper} from '@shared/queue/QueueWrapper';

export type ModelLoader = {
  load: () => Promise<Map<string, MLModel>>;
};

export class QueueManager {
  constructor(private readonly logger: Logger, private readonly store: ReduxStorage, private readonly beanFactory: BeanFactory) {
  }

  createQueue = (): QueueWrapper | undefined => {
    try {
      const map = this.beanFactory.getBean(BeanNames.AI_MODELS) as AIModels;
      return new QueueWrapper(map, this.logger, this.store);
    } catch (e) {
      this.logger.error('Error occurred while creating queue.', e);
      if (e instanceof Error) throw new Error(`unable to create Queue: ${e.message}`);
    }
  };
}
