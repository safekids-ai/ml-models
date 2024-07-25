import { ConsoleLogger } from '../../../../../src/shared/logging/ConsoleLogger';
import { PrrLevel } from '../../../../../src/shared/types/PrrLevel';
import { PrrCategory } from '../../../../../src/shared/types/PrrCategory';
import { TestUtils } from 'apps/web-filter-extension/test-utils/helpers/TestUtils';
import { PrrMonitor, UrlPrrMonitor } from '../../../../../src/pages/background/prr/monitor/PrrMonitor';
import { TriggerService } from '../../../../../src/pages/background/prr/PrrTriggerService';
import { jest } from '@jest/globals';

describe('Url Prr monitor tests', () => {
    let service: PrrMonitor;
    const logger = new ConsoleLogger();
    const category = PrrCategory.EDUCATIONAL;
    const prrTriggerService = { trigger: jest.fn(), reset(tabId: number) {} } as TriggerService;
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
