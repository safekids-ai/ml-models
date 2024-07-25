import { ReduxStorage } from '../../../shared/types/ReduxedStorage.type';
import { Logger } from '../../../shared/logging/ConsoleLogger';

export class InterceptTimeService {
    constructor(private logger: Logger, private store: ReduxStorage) {}

    getOffTimes = async (current: Date): Promise<any> => {
        let offTimes = { isOffDay: true, isOffTime: true };
        try {
            const { isHoliday, schoolTime, lightOffTime } = this.store.getState().settings;
            this.logger.log(
                `current:${current},isHoliday=${isHoliday},schoolTime: ${JSON.stringify(schoolTime)},lightoffTime : ${JSON.stringify(lightOffTime)}`
            );
            const isSchoolTime = !schoolTime || this.inBetweenInterceptTime(current, String(schoolTime.startTime), String(schoolTime.endTime));
            const isSleepTime = !lightOffTime || this.inBetweenInterceptTime(current, String(lightOffTime.startTime), String(lightOffTime.endTime));
            this.logger.log(`OFFTIME -> ${!(isSchoolTime || isSleepTime)}`);
            offTimes = { isOffDay: isHoliday, isOffTime: !(isSchoolTime || isSleepTime) };
        } catch (e) {
            this.logger.error(`Error occurred while getting offtimes. ${e}`);
        }
        return offTimes;
    };

    isLeisureTime = async (current: Date): Promise<boolean> => {
        const offTimes = await this.getOffTimes(current);
        if (offTimes.isOffDay) {
            this.logger.log('Today is Holiday so PRR is not Triggered');
            return true;
        } else if (!offTimes.isOffTime) {
            this.logger.log('Time lies in either school Time or sleep Time, so prr trigger should apply');
            return false;
        } else {
            this.logger.log('Neither Holiday nor school Time, SleepTime so PRR should not be trigger');
            return true;
        }
    };

    inBetweenInterceptTime = (current: Date, startTime: string, endTime: string): boolean => {
        const startDate = new Date();
        const startTimes = startTime.split(':');
        let startHours = +startTimes[0];
        let startMinutes = +startTimes[1];
        let startSeconds = +startTimes[2];
        startDate.setHours(startHours, startMinutes, startSeconds, 0);

        const endDate = new Date();
        const endTimes = endTime.split(':');
        let endHours = +endTimes[0] < startHours ? +endTimes[0] + 24 : +endTimes[0];
        let endMinutes = +endTimes[1];
        let endSeconds = +endTimes[2];
        endDate.setHours(endHours, endMinutes, endSeconds, 0);

        return current >= startDate && current <= endDate;
    };
}
