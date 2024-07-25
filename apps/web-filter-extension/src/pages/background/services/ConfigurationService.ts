import * as background from '../../background/index';
import { AlarmType } from '../../../shared/types/Alam.type';
import { addMinutes, isAfter } from 'date-fns';
import { UserService } from './UserService';
import { LocalStorageManager } from '../../../shared/chrome/storage/ChromeStorageManager';
import { Logger } from '../../../shared/logging/ConsoleLogger';
import { RESTService } from '../../../shared/rest/RestService';
import { ChromeExtensionStatus } from '../../../shared/types/ChromeExtensionStatus.type';
import { Configuration } from '../../../shared/types/Configuration.type';
import { FilteredCategory } from '../../../shared/types/FilteredCategory.type';
import { ReduxStorage } from '../../../shared/types/ReduxedStorage.type';
import { setFilteredCategories, setInterceptionCategories, setNonPermissibleUrls, setPermissibleUrls } from '../../popup/redux/actions/settings';
import { GET_EXTENSION_CONFIGURATION } from './endpoints';
import { ChromeCommonUtils } from '../../../shared/chrome/utils/ChromeCommonUtils';
import RequestUpdateCheckStatus = chrome.runtime.RequestUpdateCheckStatus;
import UpdateCheckDetails = chrome.runtime.UpdateCheckDetails;

export type ConfigurationService = {
    setDefaultExtensionConfiguration: (accessCode: string) => Promise<void>;
    getChromeExtensionConfiguration: () => Promise<void>;
    updateChromeExtensionAlarm: (status: RequestUpdateCheckStatus, details?: UpdateCheckDetails) => void;
};

export class ConfigurationServiceImpl implements ConfigurationService {
    constructor(
        private readonly store: ReduxStorage,
        private readonly logger: Logger,
        private readonly restService: RESTService,
        private readonly storageManager: LocalStorageManager,
        private readonly userService: UserService
    ) {}

    public async setDefaultExtensionConfiguration(accessCode: string): Promise<void> {
        chrome.runtime.setUninstallURL(`${process.env.BACKEND_URL}/v2/chrome/consumer/reportAppUninstall?code=${accessCode}`);
    }

    async getChromeExtensionConfiguration(): Promise<void> {
        try {
            const extensionConfigurationResult: Configuration = await this.restService.doGet(GET_EXTENSION_CONFIGURATION);

            const {
                permissible = [],
                nonPermissible = [],
                filteredCategories = [],
                interceptionCategories = [],
                kidConfig,
                accessLimited = false,
                subscription = true,
            } = extensionConfigurationResult;

            const parsedPermissibleUrls = permissible?.map((url: string) => (url.startsWith('www.') ? url.replace('www.', '') : url)) ?? [];
            const parsedNonPermissibleUrls = nonPermissible?.map((url: string) => (url.startsWith('www.') ? url.replace('www.', '') : url)) ?? [];

            const parsedFilteredCategories: any = {};
            filteredCategories.forEach((category: FilteredCategory) => {
                parsedFilteredCategories[category.categoryId] = category.status;
            });
            const parsedInterceptionCategories = interceptionCategories?.map((category: string) => category.toUpperCase()) ?? [];

            await this.store.dispatch(setPermissibleUrls(parsedPermissibleUrls));
            await this.store.dispatch(setNonPermissibleUrls(parsedNonPermissibleUrls));
            await this.store.dispatch(setFilteredCategories(parsedFilteredCategories));
            await this.store.dispatch(setInterceptionCategories(parsedInterceptionCategories));

            await this.storageManager.set({ permissible: parsedPermissibleUrls });
            await this.storageManager.set({ nonPermissible: parsedNonPermissibleUrls });
            await this.storageManager.set({ filteredCategories: parsedFilteredCategories });
            await this.storageManager.set({ interceptionCategories: parsedInterceptionCategories });

            // access limited save/update
            this.logger.log(`Access Limited status: ${accessLimited}`);
            if (accessLimited === true) {
                const isAfterRestoreTime = isAfter(new Date(), addMinutes(new Date(kidConfig?.accessLimitedAt), 5));
                if (isAfterRestoreTime) {
                    this.userService.updateAccess(false, '');
                } else {
                    await this.storageManager.set({ accessLimited, accessLimitedAt: kidConfig?.accessLimitedAt });
                }
            } else {
                const localAccessStatus: boolean = await this.storageManager.get('accessLimited');
                this.logger.log(`Local Access Status: ${localAccessStatus}`);
                if (localAccessStatus === true) {
                    this.userService.updateLimitAccessLocally(false);
                }
            }

            // subscription save for enable/disable extension
            this.logger.log(`Subscription status: ${subscription}`);
            if (!subscription) {
                chrome.alarms.clear(AlarmType.CONFIGURATION_ALARM);
                chrome.alarms.clear(AlarmType.PRR2_LIMIT_ALARM);
                await this.storageManager.set({ subscriptionStatus: false });
            } else {
                const localSubscriptionStatus: boolean = await this.storageManager.get('subscriptionStatus');
                this.logger.log(`Local Subscription Status: ${localSubscriptionStatus}`);
                if (localSubscriptionStatus === false) {
                    await this.storageManager.set({ subscriptionStatus: true });
                    await background.init();
                }
            }
        } catch (error) {
            this.logger.error(`An error occurred while getting user configurations: ${error}`);
        }
    }

    async updateChromeExtensionAlarm(status: RequestUpdateCheckStatus, details?: UpdateCheckDetails): Promise<void> {
        if (status === ChromeExtensionStatus.UPDATE_AVAILABLE) {
            ChromeCommonUtils.writeLocalStorage({ updateStatus: 'PENDING' });
        } else if (status === ChromeExtensionStatus.NO_UPDATE) {
            ChromeCommonUtils.writeLocalStorage({ updateStatus: 'NO_UPDATE' });
        }
    }
}
