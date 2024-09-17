import {ConsoleLogger} from '@shared/logging/ConsoleLogger';
import {PrrLevel} from '@shared/types/PrrLevel';
import {PrrCategory} from '@shared/types/PrrCategory';
import {TestUtils} from 'apps/web-filter-extension-old/test-utils/helpers/TestUtils';
import {PrrMonitor, UrlPrrMonitor} from './PrrMonitor';
import {TriggerService} from '../PrrTriggerService';
import {jest} from '@jest/globals';

describe('Url Prr monitor tests', () => {
  let service: PrrMonitor;
  const logger = new ConsoleLogger();
  const category = PrrCategory.EDUCATIONAL;
  const prrTriggerService = {
    trigger: jest.fn(), reset(tabId: number) {
    }
  } as TriggerService;
  const store = TestUtils.buildStore(undefined, undefined, category);
  beforeEach(async () => {
    service = new UrlPrrMonitor(prrTriggerService);
  });
  it('Should trigger prr', async () => {
    //given
    const report = {
      level: PrrLevel.THREE,
      tabId: 123,
      data: 'data',
    };

    //when
    await service.report(report);

    //then
    expect(prrTriggerService.trigger).toBeCalledTimes(1);
    expect(prrTriggerService.trigger).toBeCalledWith(report);
  });
});
