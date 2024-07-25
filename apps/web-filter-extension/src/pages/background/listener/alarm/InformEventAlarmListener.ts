import { AlarmListener } from './ConfigurationAlarmListener';
import { InformEventHandler } from '../../event/handler/InformEventHandler';
import Alarm = chrome.alarms.Alarm;

export class InformEventAlarmListener implements AlarmListener {
    constructor(private tabVisitManager: InformEventHandler) {}

    onAlarm = async (alarm: Alarm): Promise<boolean> => {
        let tabIdStr = alarm.name.replaceAll('INFORM_EVENT_', '') as unknown;
        let tabId: number = tabIdStr as number;
        await this.tabVisitManager.endEvent(tabId);
        return true;
    };
}
