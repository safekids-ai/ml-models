import { LocalStorageManager } from '../../../shared/chrome/storage/ChromeStorageManager';
import { Logger } from '../../../shared/logging/ConsoleLogger';
import { PrrLevel } from '../../../shared/types/PrrLevel';
import { ReduxStorage } from '../../../shared/types/ReduxedStorage.type';
import { PrrReport } from './monitor/PrrMonitor';

export type PrrLevelChecker = {
    check: (prrReport: any, tabPrrModel?: any) => Promise<any>;
};

export class PrrLevelCheckerImpl implements PrrLevelChecker {
    constructor(private readonly store: ReduxStorage, private readonly logger: Logger, private readonly localStorage: LocalStorageManager) {}

    async check(tabPRRModel: PrrReport): Promise<any> {
        tabPRRModel.accessLimited = false;

        this.logger.log(`tabPRRModel----: ${JSON.stringify(tabPRRModel)}`);
        // if Prr Level is 3 , we are not considering it for Prr level 2 flow so return it
        if (tabPRRModel.level == PrrLevel.THREE) {
            return tabPRRModel;
        }

        const { prr1Limit, prr2Threshold } = this.store.getState().settings;
        const firstPRR2TimeLimit = await this.localStorage.get('firstPRR2TimeLimit');

        // set defaults
        const prr1LimitLocal = isNaN(prr1Limit) || !prr1Limit ? 3 : prr1Limit;
        const prr2ThresholdLocal = isNaN(prr2Threshold) || !prr2Threshold ? 60 : prr2Threshold;

        // read PRR Level 1 Counter
        let prr1Counter = await this.localStorage.get('prr1Counter');
        if (isNaN(prr1Counter)) {
            prr1Counter = 0;
            await this.localStorage.set({ prr1Counter: 0 });
        }
        // read PRR Level 2 Counter
        let prr2Counter = await this.localStorage.get('prr2Counter');
        if (isNaN(prr2Counter)) {
            prr2Counter = 0;
            this.localStorage.set({ prr2Counter: 0 });
        }

        // When last PRR is triggered. TODO: check what is usage of this
        const lastPRRTriggerTime = await this.localStorage.get('lastPRRTriggerTime');

        if (((tabPRRModel.level as PrrLevel) !== PrrLevel.THREE && prr1Counter == 0) || (lastPRRTriggerTime && new Date(lastPRRTriggerTime) < new Date())) {
            const last3minuteTime = new Date().setMinutes(new Date().getMinutes() + 3);
            this.localStorage.set({ lastPRRTriggerTime: last3minuteTime });
            prr1Counter = 0;
            this.localStorage.set({ prr1Counter });
        }
        if (prr1Counter == 4) {
            prr1Counter = 0;
        }
        prr1Counter++;
        this.localStorage.set({ prr1Counter });

        this.logger.debug(`Now Prr 1 Counter = [${prr1Counter}] ,firstPRR2TimeLimit=[${firstPRR2TimeLimit}]`);

        if (prr1Counter > prr1LimitLocal && (tabPRRModel.level as PrrLevel) != PrrLevel.THREE) {
            tabPRRModel.level = PrrLevel.TWO;
            // check if user triggers second PRR2 before limit time (first PRR 2 + prr2Threshold min)
            if (prr2Counter == 1 && firstPRR2TimeLimit && new Date() < new Date(firstPRR2TimeLimit)) {
                this.localStorage.set({ prr2LimitExceeded: true });
                tabPRRModel.accessLimited = true;
                prr2Counter = 0;
            } else {
                this.localStorage.set({ prr2LimitExceeded: false });
                const future1HourTime = new Date().setMinutes(new Date().getMinutes() + +prr2ThresholdLocal);
                this.localStorage.set({ firstPRR2TimeLimit: future1HourTime });
                tabPRRModel.accessLimited = false;
            }
            prr2Counter++;
            this.localStorage.set({ prr2Counter });
            tabPRRModel.level = PrrLevel.TWO;
        }
        return tabPRRModel;
    }
}
