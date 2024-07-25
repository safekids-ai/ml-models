import { SubscriptionAlarmListener } from '../listener/alarm/SubscriptionAlarmListener';
import { AlarmType } from '../../../shared/types/Alam.type';
import { ChromeHelperFactory } from '../../../shared/chrome/factory/ChromeHelperFactory';
import { Logger } from '../../../shared/logging/ConsoleLogger';
import { ReduxStorage } from '../../../shared/types/ReduxedStorage.type';
import { Initializer } from './Initializer';
import { ConfigurationService } from '../services/ConfigurationService';
import { AlarmListener, ConfigurationAlarmListener } from '../listener/alarm/ConfigurationAlarmListener';
import { ExtensionUpdateAlarm } from '../listener/alarm/ExtensionUpdateAlarm';
import { Prr2LimitAlarm } from '../listener/alarm/Prr2LimitAlarm';
import { InformEventHandler } from '../event/handler/InformEventHandler';
import { InformEventAlarmListener } from '../listener/alarm/InformEventAlarmListener';
import Alarm = chrome.alarms.Alarm;

/**
 * This class initializes chrome alarms and add listener for onAlarm event. Whenever an alarm is triggered.
 * corresponding alarm is fetched from alarms map and onAlarm method is called.
 */
export class AlarmInitializer implements Initializer {
    private alarmsMap: Map<string, AlarmListener>;
    constructor(
        private readonly logger: Logger,
        private readonly store: ReduxStorage,
        private readonly configurationService: ConfigurationService,
        private readonly chromeBeanFactory: ChromeHelperFactory,
        private tabVisitManager: InformEventHandler
    ) {
        this.alarmsMap = new Map<string, AlarmListener>();
    }

    public init = async (): Promise<boolean> => {
        this.createAlarms();
        chrome.alarms.onAlarm.addListener(this.handleAlarm);
        return true;
    };

    /**
     * creates list of alarms and stores in map
     */
    createAlarms = () => {
        const fetchConfigurationAlarm = new ConfigurationAlarmListener(this.configurationService, AlarmType.CONFIGURATION_ALARM, { periodInMinutes: 0.09 });
        this.alarmsMap.set(AlarmType.CONFIGURATION_ALARM, fetchConfigurationAlarm);

        const extensionUpdateAlarm = new ExtensionUpdateAlarm(this.configurationService, AlarmType.EXTENSION_UPDATE_ALARM, {
            delayInMinutes: 1,
            periodInMinutes: 300,
        });
        this.alarmsMap.set(AlarmType.EXTENSION_UPDATE_ALARM, extensionUpdateAlarm);

        const prr2LimitAlarm = new Prr2LimitAlarm(AlarmType.PRR2_LIMIT_ALARM, { periodInMinutes: 2 }, this.chromeBeanFactory.getLocalStorage());
        this.alarmsMap.set(AlarmType.PRR2_LIMIT_ALARM, prr2LimitAlarm);

        const informEventAlarmListener = new InformEventAlarmListener(this.tabVisitManager);
        this.alarmsMap.set(AlarmType.INFORM_EVENT_ALARM, informEventAlarmListener);

        const subscriptionAlarm = new SubscriptionAlarmListener(this.configurationService, AlarmType.SUBSCRIPTION_ALARM, { periodInMinutes: 1 });
        this.alarmsMap.set(AlarmType.SUBSCRIPTION_ALARM, subscriptionAlarm);
    };
    /* istanbul ignore next */
    handleAlarm = async (alarm: Alarm) => {
        let listener = alarm.name;
        if (alarm.name.startsWith('INFORM_EVENT_')) {
            listener = AlarmType.INFORM_EVENT_ALARM;
        }
        const alarmListener = this.alarmsMap.get(listener);
        await alarmListener?.onAlarm(alarm);
    };
}
