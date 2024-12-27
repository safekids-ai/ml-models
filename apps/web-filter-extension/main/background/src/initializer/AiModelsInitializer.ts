import {Initializer} from './Initializer';
import {QueueManager} from '../model/QueueManager';

export class AiModelsInitializer implements Initializer {
  constructor(private readonly queueManager: QueueManager) {
  }

  init = async (): Promise<any> => {
    const queue = await this.queueManager.createQueue();
    return await Promise.resolve(queue);
  };
}
