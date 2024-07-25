import { ConfigurationService } from '../../services/ConfigurationService';
import { AlarmType } from '../../../../shared/types/Alam.type';
import { ChromeAlarmUtil } from '../../../../shared/chrome/alarm/ChromeAlarmUtil';
import Alarm = chrome.alarms.Alarm;

export type AlarmListener = {
    onAlarm: (alarm: Alarm) => Promise<boolean>;
};

export class ConfigurationAlarmListener implements AlarmListener {
    constructor(private readonly configurationService: ConfigurationService, name: AlarmType, alarmInfo: any) {
        ChromeAlarmUtil.create(name, alarmInfo);
    }

    onAlarm = async (alarm: Alarm): Promise<boolean> => {
        // get chrome extension configuration
        await this.configurationService.getChromeExtensionConfiguration();
        return true;
    };
}
