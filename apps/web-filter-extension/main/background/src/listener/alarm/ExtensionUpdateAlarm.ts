import {AlarmType} from '@shared/types/Alam.type';
import {ChromeAlarmUtil} from '@shared/chrome/alarm/ChromeAlarmUtil';
import {AlarmListener} from './ConfigurationAlarmListener';
import {ConfigurationService} from '../../services/ConfigurationService';
import Alarm = chrome.alarms.Alarm;

export class ExtensionUpdateAlarm implements AlarmListener {
  constructor(private readonly configurationService: ConfigurationService, name: AlarmType, alarmInfo: any) {
    ChromeAlarmUtil.create(name, alarmInfo);
  }

  onAlarm = async (alarm: Alarm): Promise<boolean> => {
    const that = this;
    chrome.runtime.requestUpdateCheck(that.configurationService.updateChromeExtensionAlarm);
    return true;
  };
}
