import { ChromeAlarmUtil } from './ChromeAlarmUtil';
import { AlarmType } from '../../types/Alam.type';
import AlarmCreateInfo = chrome.alarms.AlarmCreateInfo;

describe('ChromeAlarmUtil Test', () => {
    it('Should create a new alarm', async () => {
        //given
        const createAlarmSpy = jest.fn((name: string, alarmInfo: AlarmCreateInfo) => {});
        global.chrome = {
            alarms: {
                // @ts-ignore
                create: (name: string, alarmInfo: AlarmCreateInfo): void => {
                    createAlarmSpy(name, alarmInfo);
                },
            },
        };

        //when
        ChromeAlarmUtil.create(AlarmType.CHECK_LOGIN_ALARM, { periodInMinutes: 2 });

        //then
        expect(createAlarmSpy).toBeCalled();
    });
});
