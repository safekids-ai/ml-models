import { AlarmType } from '@shared/types/Alam.type';

export class ChromeAlarmUtil {
    static create(name: AlarmType | string, alarmInfo: any): void {
        chrome.alarms.create(name, alarmInfo);
    }
}
