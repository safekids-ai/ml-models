import { EDUCATION_HOSTS } from '@shared/types/education';

import { EducationalCodes } from '@shared/chrome/utils/EducationalCodes';
import { HttpUtils } from '@shared/utils/HttpUtils';
import { Credentials } from '@shared/types/message_types';
import { ConsoleLogger } from '@shared/logging/ConsoleLogger';

// TODO: refactor package and name
export class ChromeCommonUtils {
    private static logger = new ConsoleLogger();

    private static readonly EDUCATION_HOSTS = {
        'class.com': 0,
        'blackboard.com': 0,
        'khanacademy.org': 0,
        'ixl.com': 0,
        'lexiapowerup.com': 0,
        'dns.google': 0,
        'mail.google.com': 0,
        'gmail.com': 0,
        'schoology.com': 0,
        'acceleratelearning.com': 0,
        'app.acceleratelearning.com': 0,
        'kahoot.it': 0,
        'nwea.org': 0,
        'test.mapnwea.org': 0,
        'drcdirect.com': 0,
        'laslinks.com': 0,
        'noredink.com': 0,
        'newsela.com': 0,
        'gimkit.com': 0,
        'booklet.com': 0,
        'yup.com': 0,
        'docs.google.com': 0,
        'stemscopes.com': 0,
    };

    /** check host is in permissible urls or educational hosts
     * @param  {string} host
     * @param  permissibleUrls
     * @returns boolean
     */
    static isHostPermissibleOrEducational = (host: string, permissibleUrls: string[]): boolean => {
        const lowerHost = host.startsWith('www.') ? host.replace('www.', '') : host;
        if (permissibleUrls && permissibleUrls.length > 0) {
            const permissibleDomains = permissibleUrls.map((url) => HttpUtils.getRootDomain(url));
            if (permissibleDomains?.length > 0 && permissibleDomains.includes(lowerHost)) {
                return true;
            }
            // eslint-disable-next-line no-prototype-builtins
        } else if (ChromeCommonUtils.EDUCATION_HOSTS.hasOwnProperty(lowerHost)) {
            return true;
        }
        return false;
    };

    static inEducationalCodes = (categoryCodes: number[]): boolean => {
        return categoryCodes.some((r) => EducationalCodes.get().includes(r));
    };

    static getEducationHosts() {
        return [{ category: 'Education', hosts: EDUCATION_HOSTS }];
    }

    static async readLocalStorage(key: string): Promise<any> {
        return await new Promise((resolve, reject) => {
            chrome.storage.local.get([key], function (result) {
                resolve(result[key]);
            });
        });
    }

    static async writeLocalStorage(key: any, callback?: () => void): Promise<void> {
        chrome.storage.local.set(key, callback);
    }

    static getUserCredentials = async (): Promise<Credentials> => {
        const credentials = await ChromeCommonUtils.readLocalStorage('credentials');
        if (credentials === undefined) {
            return { accessCode: '' };
        }
        return credentials;
    };

    static getPermissibleURLs = async (): Promise<string[]> => {
        const permissible = await ChromeCommonUtils.readLocalStorage('permissible');
        if (permissible === undefined) {
            return [];
        }
        return permissible;
    };

    static wakeup = () => {
        const logger = ChromeCommonUtils.logger;
        setTimeout(() => {
            if (!chrome.runtime?.id) {
                logger.log("***WARNING** - Couldn't ping since it's disconnected");
            } else {
                const request = { type: 'PING', val: 'browser ping' };
                chrome.runtime.sendMessage(request, (response) => {
                    if (!chrome.runtime || chrome.runtime.lastError) {
                        return;
                    }
                    logger.log(response);
                });
            }
            ChromeCommonUtils.wakeup();
        }, 10000);
    };

    static getLogger() {
        return ChromeCommonUtils.logger;
    }

    static timeout(ms: any) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    static async getJWTToken(): Promise<any> {
        return await ChromeCommonUtils.readLocalStorage('jwtToken');
    }

    static async getAccessLimitedTime(): Promise<any> {
        return await ChromeCommonUtils.readLocalStorage('accessLimitedAt');
    }
}
