import { LoginDto } from '../../../shared/types/LoginDto.type';

import { ChromeUtils } from '../../../shared/chrome/utils/ChromeUtils';
import { Logger } from '../../../shared/logging/ConsoleLogger';
import { RESTService } from '../../../shared/rest/RestService';
import { BROWSERS } from '../../../shared/types/message_types';
import { UserProfile } from '../../../shared/types/UserProfile.type';
import { HttpUtils } from '../../../shared/utils/HttpUtils';
import { CHROME_EXTENSION_LOGIN } from './endpoints';
import { ChromeStorageManager } from '../../../shared/chrome/storage/ChromeStorageManager';
import { init } from '../index';

export interface AuthenticationService {
    login: (accessCode: string) => Promise<boolean>;
}

/**
 * AuthenticationService Class
 */
export class AuthenticationServiceImpl implements AuthenticationService {
    constructor(
        private readonly logger: Logger,
        private readonly localStorageManager: ChromeStorageManager,
        private readonly chromeUtils: ChromeUtils,
        private readonly restService: RESTService
    ) {}

    async login(accessCode: string): Promise<boolean> {
        const loginPayload: UserProfile = await this.getLoginPayload(accessCode);
        const response: LoginDto = await this.restService.doPost(CHROME_EXTENSION_LOGIN, loginPayload);

        if (response.jwt_token) {
            await this.chromeUtils.saveLoginCredentials(accessCode, response.jwt_token, response.link, true);

            // re-initialized background as after login need to reactive
            init();

            return true;
        }
        this.logger.log(`Login Unsuccessfull...`);
        return false;
    }

    async getLoginPayload(accessCode: string): Promise<UserProfile> {
        const profile: UserProfile = { accessCode };

        const browser = HttpUtils.getBrowserInfo();
        const browserName = browser.split(' ')[0];
        if (browserName.toUpperCase() === BROWSERS.CHROME) {
            if (profile.accessCode != null) {
                profile.directoryApiId = profile.accessCode;
                profile.deviceType = 'Normal';
            }
            const cpuInfo = await this.chromeUtils.promiseChrome(chrome.system.cpu.getInfo);
            const platformInfo = await this.chromeUtils.promiseChrome(chrome.runtime.getPlatformInfo);
            profile.platformInfo = platformInfo;

            profile.deviceName = cpuInfo?.modelName ? `${cpuInfo?.modelName}-${profile.deviceType}` : `${profile.accessCode}-${profile.deviceType}`;
        }

        return profile;
    }
}
