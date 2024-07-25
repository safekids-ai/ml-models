import { ReduxStorage } from '@src//shared/types/ReduxedStorage.type';
import { Logger } from '@src//shared/logging/ConsoleLogger';
import { HttpUtils } from '@src//shared/utils/HttpUtils';
import { ChromeCommonUtils } from '@src//shared/chrome/utils/ChromeCommonUtils';

export class ContentFilterUtil {
    constructor(private readonly store: ReduxStorage, private readonly logger: Logger) {}
    /** check if host is allowed from store setting
     * @param  {string} host
     * @param  {ReduxStorage} store
     * @returns boolean
     */
    isHostAllowed = (host: string): boolean => {
        const { permissibleUrls } = this.store.getState().settings;
        const lowerHost = host.startsWith('www.') ? host.replace('www.', '') : host;
        if (permissibleUrls && permissibleUrls.length > 0) {
            const permissibleDomains = permissibleUrls.map((url: string) => HttpUtils.getRootDomain(url));
            if (permissibleDomains.includes(lowerHost)) {
                this.logger.log(`${host} is in filtered allowed list.`);
                return true;
            }
        } else {
            const defaultAllowedHost = ChromeCommonUtils.getEducationHosts();
            for (let i = 0; i < defaultAllowedHost.length; i++) {
                const hosts = defaultAllowedHost[i].hosts;
                if (Object.prototype.hasOwnProperty.call(hosts, lowerHost)) {
                    return true;
                }
            }
        }
        this.logger.log(`${lowerHost} is not in allowed list.`);
        return false;
    };
}
