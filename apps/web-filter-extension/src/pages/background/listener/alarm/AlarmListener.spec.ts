import { SubscriptionAlarmListener } from './../../../../../src/pages/background/listener/alarm/SubscriptionAlarmListener';
import { ChromeAlarmUtil } from '../../../../../src/shared/chrome/alarm/ChromeAlarmUtil';
import { ConfigurationAlarmListener } from '../../../../../src/pages/background/listener/alarm/ConfigurationAlarmListener';
import { Prr2LimitAlarm } from '../../../../../src/pages/background/listener/alarm/Prr2LimitAlarm';
import { LocalStorageManager } from '../../../../../src/shared/chrome/storage/ChromeStorageManager';
import { ExtensionUpdateAlarm } from '../../../../../src/pages/background/listener/alarm/ExtensionUpdateAlarm';
import { mock } from 'ts-mockito';
import { ConfigurationServiceImpl } from '../../../../../src/pages/background/services/ConfigurationService';
import { AlarmType } from '../../../../../src/shared/types/Alam.type';
import { Alarms } from 'jest-chrome/types/jest-chrome';
import Alarm = Alarms.Alarm;

describe('AlarmListener test', () => {
    const localStorage = new LocalStorageManager();
    jest.spyOn(ChromeAlarmUtil, 'create').mockImplementation((name: string, info: any) => {});
    const configurationService = mock(ConfigurationServiceImpl);
    beforeEach(async () => {});

    it('Should handle CONFIGURATION_ALARM onAlarm', async () => {
        const alarmParam: Alarm = { name: AlarmType.CONFIGURATION_ALARM, scheduledTime: 111133, periodInMinutes: 1 };
        const alarm = new ConfigurationAlarmListener(configurationService, AlarmType.CONFIGURATION_ALARM, {});
        const result = alarm.onAlarm(alarmParam);
        expect(result).toBeTruthy();
    });

    it('Should handle PRR2_LIMIT_ALARM onAlarm', async () => {
        const alarmParam: Alarm = { name: AlarmType.PRR2_LIMIT_ALARM, scheduledTime: 111133, periodInMinutes: 1 };
        const date = new Date();
        date.setTime(date.getTime() - 100);
        jest.spyOn(localStorage, 'get').mockResolvedValue(date);
        jest.spyOn(localStorage, 'set').mockImplementation(async (value: any) => {});
        const alarm = new Prr2LimitAlarm(AlarmType.PRR2_LIMIT_ALARM, {}, localStorage);
        alarm.onAlarm(alarmParam);
    });
    //EXTENSION_UPDATE_ALARM
    it('Should handle EXTENSION_UPDATE_ALARM onAlarm', async () => {
        const alarmParam: Alarm = { name: AlarmType.EXTENSION_UPDATE_ALARM, scheduledTime: 111133, periodInMinutes: 1 };
        global.chrome = {
            // @ts-ignore
            runtime: {
                requestUpdateCheck: jest.fn(),
            },
        };
        const alarm = new ExtensionUpdateAlarm(configurationService, AlarmType.EXTENSION_UPDATE_ALARM, {});
        const result = await alarm.onAlarm(alarmParam);
        expect(result).toBeTruthy();
    });

    it('Should handle SUBSCRIPTION_ALARM onAlarm', async () => {
        const alarmParam: Alarm = { name: AlarmType.CONFIGURATION_ALARM, scheduledTime: 111133, periodInMinutes: 1 };
        const alarm = new SubscriptionAlarmListener(configurationService, AlarmType.SUBSCRIPTION_ALARM, {});
        const result = await alarm.onAlarm(alarmParam);
        expect(result).toBeTruthy();
    });
});
