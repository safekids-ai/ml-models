import { PrrTriggerService, TriggerService } from '../../../../src/pages/background/prr/PrrTriggerService';
import { PrrReportManager } from '../../../../src/pages/background/prr/PrrReportManager';
import { PrrLevelCheckerImpl } from '../../../../src/pages/background/prr/PrrLevelChecker';
import { ActivityService, ActivityServiceImpl } from '../../../../src/pages/background/services/ActivityService';
import { PrrReports } from '../../../../src/shared/prr/PrrReports';
import { PrrLevel } from '../../../../src/shared/types/PrrLevel';
import { LocalStorageManager } from '../../../../src/shared/chrome/storage/ChromeStorageManager';
import { InterceptTimeService } from '../../../../src/pages/background/services/InterceptTimeService';
import { ConsoleLogger } from '../../../../src/shared/logging/ConsoleLogger';
import { AxiosApiService } from '../../../../src/shared/rest/RestService';
import { ConfigurationServiceImpl } from '../../../../src/pages/background/services/ConfigurationService';
import { jest } from '@jest/globals';
import { ChromeUtils } from '../../../../src/shared/chrome/utils/ChromeUtils';
import { mock } from 'ts-mockito';
import { ChromeTabHelper } from '../../../../src/shared/chrome/tabs/ChromeTabHelper';
import { TestUtils } from 'apps/web-filter-extension/test-utils/helpers/TestUtils';
import { UrlStatus } from '../../../../src/shared/types/UrlStatus';
import { PrrReport } from '../../../../src/pages/background/prr/monitor/PrrMonitor';
import { PrrCategory } from '../../../../src/shared/types/PrrCategory';
import { PrrTrigger } from '../../../../src/shared/types/message_types';

describe('Prr trigger service test', () => {
    let service: TriggerService;
    let prrReportManager: PrrReportManager;
    let activityService: ActivityService;
    const logger = new ConsoleLogger();
    const store = TestUtils.buildSettingsState();
    const localStorage = new LocalStorageManager();
    const prrReports = new PrrReports();

    const chromeTabHelper = mock<ChromeTabHelper>();
    const chromeUtils = mock<ChromeUtils>();
    const prrLevelChecker = new PrrLevelCheckerImpl(store, logger, localStorage);
    const interceptionService = new InterceptTimeService(logger, store);
    const restService = mock(AxiosApiService);
    const configurationService = mock(ConfigurationServiceImpl);

    beforeEach(async () => {
        prrReportManager = new PrrReportManager(prrReports);
        activityService = new ActivityServiceImpl(
            store,
            logger,
            chromeUtils,
            localStorage,
            restService,
            configurationService,
            prrReportManager,
            interceptionService
        );
        service = new PrrTriggerService(logger, chromeTabHelper, chromeUtils, prrReportManager, activityService, prrLevelChecker);
    });

    describe('Trigger prr', () => {
        it('Should not trigger prr if prr already triggered for tab', async () => {
            //given
            const report: PrrReport = {
                tabId: 11,
                status: UrlStatus.BLOCK,
            };

            //mock dependencies
            jest.spyOn(prrReportManager, 'getReport').mockReturnValue(report);
            jest.spyOn(prrReportManager, 'add').mockReturnValue();
            jest.spyOn(activityService, 'prrTriggered').mockImplementation(async (prrReport: PrrReport) => {
                return report;
            });

            //when
            await service.trigger(report);

            //then
            expect(prrReportManager.add).toBeCalledTimes(0);
            expect(activityService.prrTriggered).toBeCalledTimes(0);
        });

        it('Should not trigger prr if url status is allowed', async () => {
            //given
            const report: PrrReport = {
                tabId: 1,
                status: UrlStatus.ALLOW,
            };

            //mock dependencies
            jest.spyOn(prrReportManager, 'add').mockReturnValue();

            //when
            await service.trigger(report);

            //then
            expect(prrReportManager.add).toBeCalledTimes(0);
        });

        it('Should trigger prr if prr level is three', async () => {
            //given
            const report: PrrReport = {
                fullWebUrl: 'www.facebook.com',
                category: PrrCategory.PROXY,
                tabId: 1,
                prrTriggerId: PrrTrigger.AI_VISION,
                url: 'facebook.com',
                prrTriggered: true,
                images: [],
                texts: [],
                level: PrrLevel.THREE,
                status: UrlStatus.BLOCK,
            };

            //mock dependencies
            jest.spyOn(prrReportManager, 'add').mockReturnValue();
            jest.spyOn(prrLevelChecker, 'check').mockResolvedValue(report);
            jest.spyOn(activityService, 'prrTriggered').mockImplementation(async (prrReports: PrrReport) => {});

            //when
            await service.trigger(report);

            //then
            expect(prrReportManager.add).toBeCalledTimes(1);
            expect(prrReportManager.add).toBeCalledWith(report.tabId, report);

            expect(prrLevelChecker.check).toBeCalledTimes(1);
            // expect(prrLevelChecker.check).toBeCalledWith(report, undefined)

            expect(activityService.prrTriggered).toBeCalledTimes(1);
            expect(activityService.prrTriggered).toBeCalledWith(report);
            expect(prrReportManager.add).toBeCalledTimes(1);
        });

        it('Should trigger prr after prr report reset for the tab', async () => {
            //given
            let report: PrrReport = {
                tabId: 11,
                status: UrlStatus.BLOCK,
            };

            jest.spyOn(prrReportManager, 'getReport').mockReturnValueOnce(report);
            jest.spyOn(activityService, 'prrTriggered').mockImplementation(async (prrReports: PrrReport) => {});

            //when
            await service.trigger(report);

            expect(activityService.prrTriggered).toBeCalledTimes(0);

            service.reset(1);

            //given
            report = {
                fullWebUrl: 'www.facebook.com',
                category: PrrCategory.EXPLICIT,
                tabId: 1,
                prrTriggerId: PrrTrigger.AI_VISION,
                url: 'facebook.com',
                prrTriggered: true,
                images: [],
                texts: [],
                level: PrrLevel.ONE,
                status: UrlStatus.BLOCK,
            };

            //mock dependencies
            jest.spyOn(prrReportManager, 'add').mockReturnValue();
            jest.spyOn(prrLevelChecker, 'check').mockResolvedValue(report);

            //when
            await service.trigger(report);

            //then
            expect(prrReportManager.add).toBeCalledTimes(1);
            expect(prrReportManager.add).toBeCalledWith(report.tabId, report);
        });
    });
});
