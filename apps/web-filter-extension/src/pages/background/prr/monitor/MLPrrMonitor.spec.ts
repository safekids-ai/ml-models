import { PrrLevel } from '../../../../../src/shared/types/PrrLevel';
import { MLModels } from '../../../../../src/shared/types/MLModels';
import { PrrCategory } from '../../../../../src/shared/types/PrrCategory';
import { TestUtils } from 'apps/web-filter-extension/test-utils/helpers/TestUtils';
import { ConsoleLogger } from '../../../../../src/shared/logging/ConsoleLogger';
import { PrrMonitor } from '../../../../../src/pages/background/prr/monitor/PrrMonitor';
import { MLPrrMonitor } from '../../../../../src/pages/background/prr/monitor/MLPrrMonitor';
import { PrrTriggerService, TriggerService } from '../../../../../src/pages/background/prr/PrrTriggerService';
import { jest } from '@jest/globals';
import { LocalStorageManager } from '../../../../../src/shared/chrome/storage/ChromeStorageManager';
import { ChromeTabHelper } from '../../../../../src/shared/chrome/tabs/ChromeTabHelper';
import { ChromeUtils } from '../../../../../src/shared/chrome/utils/ChromeUtils';
import { PrrReportManager } from '../../../../../src/pages/background/prr/PrrReportManager';
import { PrrReports } from '../../../../../src/shared/prr/PrrReports';
import { mock } from 'ts-mockito';
import { ActivityServiceImpl } from '../../../../../src/pages/background/services/ActivityService';
import { PrrLevelCheckerImpl } from '../../../../../src/pages/background/prr/PrrLevelChecker';

describe('ML Prr monitor tests', () => {
    let service: PrrMonitor;
    const logger = new ConsoleLogger();
    const category = PrrCategory.EDUCATIONAL;
    const store = TestUtils.buildStore(undefined, undefined, category);
    const localStorageManager = new LocalStorageManager();
    let prrReports = new PrrReports();
    const prrReportManager = new PrrReportManager(prrReports);
    const chromeUtils = new ChromeUtils(logger, localStorageManager);
    const activityService = mock(ActivityServiceImpl);
    const prrLevelChecker = mock(PrrLevelCheckerImpl);
    const chromeTabHelper: ChromeTabHelper = new ChromeTabHelper(logger, store);
    const prrTriggerService = new PrrTriggerService(logger, chromeTabHelper, chromeUtils, prrReportManager, activityService, prrLevelChecker);

    beforeEach(async () => {
        service = new MLPrrMonitor(logger, store, prrTriggerService, localStorageManager);
    });

    it('Should not trigger prr if ML or NLP count is less than threshold', async () => {
        //given
        const report = {
            level: PrrLevel.THREE,
            tabId: 123,
            model: MLModels.VISION,
            category,
            data: 'data',
        };
        jest.spyOn(prrTriggerService, 'trigger').mockImplementation(async () => {
            Promise.resolve();
        });

        //when
        await service.report(report);

        //then
        expect(prrTriggerService.trigger).toBeCalledTimes(0);
    });

    it('Should trigger prr level 3 with nlp', async () => {
        const store = TestUtils.buildStore(undefined, undefined, PrrCategory.WEAPONS);
        const chromeTabHelper: ChromeTabHelper = new ChromeTabHelper(logger, store);
        const prrTriggerService = new PrrTriggerService(logger, chromeTabHelper, chromeUtils, prrReportManager, activityService, prrLevelChecker);

        service = new MLPrrMonitor(logger, store, prrTriggerService, localStorageManager);

        //given
        const tabId = 123;
        //given
        let visionReport = {
            level: PrrLevel.THREE,
            tabId,
            model: MLModels.VISION,
            category: PrrCategory.WEAPONS,
            data: 'data',
            url: 'https://www.google.com',
        };

        let nlpReport = {
            level: PrrLevel.THREE,
            tabId,
            model: MLModels.NLP,
            category: PrrCategory.WEAPONS,
            data: 'data',
            url: 'https://www.google.com',
        };

        jest.spyOn(prrTriggerService, 'trigger').mockImplementation(async () => {
            Promise.resolve();
        });

        //when
        await service.report(nlpReport);
        await service.report(nlpReport);
        await service.report(nlpReport);
        await service.report(nlpReport);

        //then
        const report = {
            category: 'WEAPONS',
            tabId,
            prrTriggerId: 'AI-NLP',
            url: 'www.google.com',
            prrTriggered: true,
            images: [],
            texts: ['data', 'data', 'data', 'data'],
            level: PrrLevel.THREE,
            isAiGenerated: true,
            status: 'block',
        };
        expect(prrTriggerService.trigger).toBeCalledTimes(1);
        expect(prrTriggerService.trigger).toBeCalledWith(report);
    });

    it('Should trigger prr level 1 with nlp and vision', async () => {
        const store = TestUtils.buildStore(undefined, undefined, PrrCategory.EXPLICIT);
        const chromeTabHelper: ChromeTabHelper = new ChromeTabHelper(logger, store);
        const prrTriggerService = new PrrTriggerService(logger, chromeTabHelper, chromeUtils, prrReportManager, activityService, prrLevelChecker);

        service = new MLPrrMonitor(logger, store, prrTriggerService, localStorageManager);

        //given
        const tabId = 123;
        //given
        let visionReport = {
            level: PrrLevel.ONE,
            tabId,
            model: MLModels.VISION,
            category: PrrCategory.EXPLICIT,
            data: 'data',
            url: 'https://www.guns.com',
        };

        let nlpReport = {
            level: PrrLevel.ONE,
            tabId,
            model: MLModels.NLP,
            category: PrrCategory.EXPLICIT,
            data: 'data',
            url: 'https://www.google.com',
        };

        jest.spyOn(prrTriggerService, 'trigger').mockImplementation(async () => {
            Promise.resolve();
        });

        //when
        await service.report(visionReport);
        await service.report(nlpReport);
        await service.report(nlpReport);

        //then
        const report = {
            category: 'ADULT_SEXUAL_CONTENT',
            tabId: 123,
            prrTriggerId: 'AI-NLP-VISION',
            url: 'www.google.com',
            prrTriggered: true,
            images: ['data'],
            texts: ['data', 'data'],
            level: PrrLevel.ONE,
            isAiGenerated: true,
            status: 'block',
        };

        expect(prrTriggerService.trigger).toBeCalledTimes(1);
        expect(prrTriggerService.trigger).toBeCalledWith(report);
    });

    it('Should trigger prr level 1 with vision', async () => {
        const store = TestUtils.buildStore(undefined, undefined, PrrCategory.SELF_HARM);
        const chromeTabHelper: ChromeTabHelper = new ChromeTabHelper(logger, store);
        const prrTriggerService = new PrrTriggerService(logger, chromeTabHelper, chromeUtils, prrReportManager, activityService, prrLevelChecker);
        jest.spyOn(prrTriggerService, 'trigger').mockImplementation(async () => {
            Promise.resolve();
        });
        service = new MLPrrMonitor(logger, store, prrTriggerService, localStorageManager);

        //given
        const tabId = 123;
        let visionReport = {
            level: PrrLevel.THREE,
            tabId,
            model: MLModels.VISION,
            category: PrrCategory.SELF_HARM,
            data: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAA',
            url: 'https://www.suicide.com',
        };
        await service.report(visionReport);

        visionReport.data = 'image.png';
        await service.report(visionReport);

        visionReport.data = 'image1.png';
        await service.report(visionReport);

        //then
        const report = {
            category: 'SELF_HARM',
            tabId: 123,
            prrTriggerId: 'AI-VISION',
            url: 'www.suicide.com',
            prrTriggered: true,
            images: ['data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAA', 'image.png', 'image1.png'],
            texts: [],
            level: PrrLevel.ONE,
            isAiGenerated: true,
            status: 'block',
        };

        expect(prrTriggerService.trigger).toBeCalledTimes(1);
        expect(prrTriggerService.trigger).toBeCalledWith(report);
    });

    it('Should reset prr report', async () => {
        //given
        const tabId = 123;
        //given
        const report = {
            level: PrrLevel.THREE,
            tabId,
            model: MLModels.VISION,
            category,
            data: 'data',
        };

        jest.spyOn(prrTriggerService, 'reset').mockImplementation(() => {});
        jest.spyOn(prrTriggerService, 'trigger').mockImplementation(async () => {
            Promise.resolve();
        });

        //when
        await service.report(report);

        //when
        await service.reset(tabId);

        //then
        expect(prrTriggerService.trigger).toBeCalledTimes(0);
    });
});
