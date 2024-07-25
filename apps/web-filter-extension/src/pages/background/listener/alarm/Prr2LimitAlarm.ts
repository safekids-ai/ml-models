import { LocalStorageManager } from '../../../../shared/chrome/storage/ChromeStorageManager';
import { AlarmType } from '../../../../shared/types/Alam.type';
import { ChromeAlarmUtil } from '../../../../shared/chrome/alarm/ChromeAlarmUtil';
import { AlarmListener } from './ConfigurationAlarmListener';
import Alarm = chrome.alarms.Alarm;

export class Prr2LimitAlarm implements AlarmListener {
    constructor(name: AlarmType, alarmInfo: any, private readonly localStorage: LocalStorageManager) {
        ChromeAlarmUtil.create(name, alarmInfo);
    }

    onAlarm = async (alarm: Alarm): Promise<boolean> => {
        const firstPRR2TimeLimit = await this.localStorage.get('firstPRR2TimeLimit');
        if (firstPRR2TimeLimit && new Date() > new Date(firstPRR2TimeLimit)) {
            this.localStorage.set({ prr2LimitExceeded: false });
        }
        return true;
    };
}
