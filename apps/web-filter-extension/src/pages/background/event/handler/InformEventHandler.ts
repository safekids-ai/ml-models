import { HttpUtils } from '../../../../shared/utils/HttpUtils';
import moment from 'moment';
import { ReduxStorage } from '../../../../shared/types/ReduxedStorage.type';
import { Logger } from '../../../../shared/logging/ConsoleLogger';
import { ActivityService } from '../../services/ActivityService';
import { ChromeStorageManager } from '../../../../shared/chrome/storage/ChromeStorageManager';
import { ChromeAlarmUtil } from '../../../../shared/chrome/alarm/ChromeAlarmUtil';

export type TabVisit = {
    timestamp: number;
    url: string;
    eventId?: string;
    time?: Date;
};

export class InformEventHandler {
    private TAB_VISIT_SUFFIX: string = 'tab-visits-';
    private INFORM_URL_SUFFIX: string = 'inform-url-';

    constructor(private logger: Logger, private store: ReduxStorage, private localStorage: ChromeStorageManager, private activityService: ActivityService) {}
    checkUrlStatus = async (tabId: number | undefined, url: string | undefined): Promise<{ status: boolean; eventId?: string }> => {
        const { informEventVisitsLimit, informEventTimeoutLimit } = this.store.getState().settings;
        let response = { status: true, eventId: '' };
        if (!tabId || !url) {
            return response;
        }
        const rootDomain = HttpUtils.refineHost(url);
        //find in tab
        const informUrl: TabVisit | undefined = await this.getInformUrls(tabId);

        //check if tab is an inform url
        if (informUrl && informUrl.url === rootDomain) {
            let notTimedOutYet = moment(informUrl.timestamp).add(informEventTimeoutLimit, 'minute').isAfter(moment());
            response.status = notTimedOutYet;
            response.eventId = informUrl.eventId as string;
            //if not timed out then allow Url
            if (notTimedOutYet) {
                let visits: TabVisit[] | undefined = await this.getTabVisits(tabId);
                if (visits && visits.length >= informEventVisitsLimit) {
                    this.endEvent(tabId);
                    response.status = false;
                } else {
                    this.addVisit(url, tabId);
                }
            } else {
                this.endEvent(tabId);
            }
        } else {
            this.endEvent(tabId);
            response.status = false;
        }
        return response;
    };

    addVisit = async (url: string, tabId: number) => {
        let visits: TabVisit[] | undefined = await this.getTabVisits(tabId);
        if (!visits) {
            visits = [];
        }
        const time = new Date();
        const timestamp = time.getTime();
        const tabVisit = { url, timestamp, time };
        visits?.push(tabVisit);

        this.saveTabVisits(tabId, visits);
    };

    endEvent = async (tabId: number) => {
        //find in tab
        const informUrl: TabVisit | undefined = await this.getInformUrls(tabId);
        if (informUrl) {
            const events = await this.getTabVisits(tabId);
            this.deleteTabVisits(tabId);
            this.deleteInformUrl(tabId);
            this.activityService.saveEvents(informUrl.eventId as string, events);
        }
    };

    reportEvent = async (tabId: number, url: string, eventId?: string) => {
        const { informEventTimeoutLimit } = this.store.getState().settings;
        const rootDomain = HttpUtils.refineHost(url);
        const time = new Date();
        const timestamp = time.getTime();
        this.saveInformUrl(tabId, { url: rootDomain, timestamp, eventId });
        await this.addVisit(url, tabId);
        ChromeAlarmUtil.create('INFORM_EVENT_' + tabId, { periodInMinutes: informEventTimeoutLimit });
    };

    saveInformUrl = (tabId: number, visit: TabVisit) => {
        const informUrlId = this.INFORM_URL_SUFFIX + tabId;
        let obj: any = {};
        obj[informUrlId] = visit;
        this.localStorage.set(obj);
    };

    saveTabVisits = (tabId: number, visits: TabVisit[]) => {
        const tabVisitId = this.TAB_VISIT_SUFFIX + tabId;
        let obj: any = {};
        obj[tabVisitId] = visits;
        this.localStorage.set(obj);
    };

    getTabVisits = async (tabId: number): Promise<TabVisit[]> => {
        const tabVisitId = this.TAB_VISIT_SUFFIX + tabId;
        return this.localStorage.get(tabVisitId);
    };

    getInformUrls = async (tabId: number): Promise<TabVisit> => {
        const informUrlId = this.INFORM_URL_SUFFIX + tabId;
        return this.localStorage.get(informUrlId);
    };

    deleteTabVisits = async (tabId: number) => {
        const tabVisitId = this.TAB_VISIT_SUFFIX + tabId;
        return this.localStorage.remove(tabVisitId);
    };

    deleteInformUrl = async (tabId: number) => {
        const informUrlId = this.INFORM_URL_SUFFIX + tabId;
        return this.localStorage.remove(informUrlId);
    };
}
