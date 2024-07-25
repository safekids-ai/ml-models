import { EventType, PrrCrisisAction, TakeMeBackEvent } from '../../../shared/types/message_types';
import { PrrLevel } from '../../../shared/types/PrrLevel';
import { defaultMessages, PrrMessages } from '../../../shared/types/PrrMessage';
import { EnumUtils } from '../../../shared/utils/EnumUtils';
import { HttpUtils } from '../../../shared/utils/HttpUtils';
import { ChromeCommonUtils } from '../../../shared/chrome/utils/ChromeCommonUtils';
import { PrrCrisis } from '../../../shared/types/PrrCrisis.type';

const is2dStringArray = (x: string | string[] | string[][]): x is string[][] => Array.isArray(x[0]);
const logger = ChromeCommonUtils.getLogger();
export const getRandomLanguageMessage = (key: keyof PrrMessages, index?: number): string => {
    const array: string | string[] | string[][] = defaultMessages[key];
    if (is2dStringArray(array)) {
        return '';
    }
    if (Array.isArray(array)) {
        if (index !== undefined && index >= 0) {
            return array[index];
        }
        return array[Math.floor(Math.random() * array.length)];
    }
    return array;
};

export const closeTab = (
    takeMeBack: boolean,
    message: string,
    category: string,
    siteName: string,
    accessLimited?: boolean,
    level?: PrrLevel,
    teachers?: any[],
    inputMessageToTeacher?: any
): void => {
    if (Boolean(inputMessageToTeacher) && teachers != null && teachers.length > 0 && level === PrrLevel.TWO) {
        teachers.forEach((teacher) => {
            chrome.runtime.sendMessage({
                type: 'REPORT_NOTIFICATION',
                messages: inputMessageToTeacher,
                teacherId: teacher.id,
                category,
                prrLevelId: level,
            });
        });
    }

    if (accessLimited === true && level === PrrLevel.TWO) {
        chrome.runtime.sendMessage(
            {
                type: EventType.REVOKE_ACCESS,
                value: true,
                category,
            },
            function () {}
        );
        ChromeCommonUtils.writeLocalStorage({ accessLimited });
    }

    if (takeMeBack) {
        const takeMeBackEvent: TakeMeBackEvent = {
            type: EventType.TAKE_ME_BACK,
            host: siteName,
            browser: HttpUtils.getBrowserInfo(),
            category: EnumUtils.getCategoryByValue(category),
            prrLevelId: level,
            text: message,
        };
        chrome.runtime.sendMessage(takeMeBackEvent);
    }
    if (level === PrrLevel.ONE) {
        window.history.go(-2);
    } else {
        chrome.runtime.sendMessage({ type: 'CLOSE_TAB' }, () => {});
    }
};

export const triggerCrisisMessage = (host: string, category: string, choseToContinue: boolean): void => {
    const logger = ChromeCommonUtils.getLogger();
    const payload: PrrCrisis = { url: host, categoryId: category, ai: true, choseToContinue };
    const eventPayload: PrrCrisisAction = { type: EventType.PRR_CRISIS_ACTION, payload };
    try {
        chrome.runtime.sendMessage(eventPayload);
    } catch (e) {
        if (e instanceof Error) {
            logger.error(`unable to send message to backend: ${e.message}`);
        } else {
            logger.error(`unable to send message to backend: ${JSON.stringify(e)}`);
        }
    }
};

export const aiTakeMeBack = async (ai: boolean, status: string, category: string, host: string, level: PrrLevel): Promise<void> => {
    const prr1Counter: number = await ChromeCommonUtils.readLocalStorage('prr1Counter');
    const prefix = 'chrome-extension://' + chrome.runtime.id + '/src/pages/ui-prr/index.html';
    if (prr1Counter === 4 && level !== PrrLevel.THREE) {
        const prrLevel2Url = `${prefix}?ai=false&status=block&category=${category}&level=2&host=${host}`;
        window.location.replace(prrLevel2Url);
    } else if (level === PrrLevel.THREE) {
        const prrLevel3Url = `${prefix}?ai=false&status=${status}&category=${category}&level=3&host=${host}&isAiBack=true`;
        triggerCrisisMessage(host, category, false);
        window.location.replace(prrLevel3Url);
    } else {
        window.history.go(-1);
    }
};

export const getInitials = (fullName: string): string => {
    const names = fullName.split(' ');
    if (names.length > 1) return `${names[0][0]}${names[1][0] || ''}`.toUpperCase();
    return names[0][0].toUpperCase();
};

export const triggerInformMessage = (host: string, category: string): void => {
    const payload = { url: host, categoryId: category, ai: true };
    const eventPayload = { type: EventType.PRR_INFORM_AI_ACTION, payload };
    try {
        chrome.runtime.sendMessage(eventPayload);
    } catch (e) {
        logger.error(`unable to send message to backend: ${JSON.stringify(e)}`);
    }
};
