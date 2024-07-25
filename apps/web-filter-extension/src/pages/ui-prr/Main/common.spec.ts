import * as Common from '../../../../src/pages/ui-prr/Main/common';
import { PrrLevel } from '../../../../src/shared/types/PrrLevel';
import { PrrCategory } from './../../../shared/types/PrrCategory';
import { ChromeCommonUtils } from './../../../shared/chrome/utils/ChromeCommonUtils';
import { HttpUtils } from '../../../../src/shared/utils/HttpUtils';
describe('Commons Test', () => {
    const callback = jest.fn((request: any, callback: (response: any) => Promise<void>): void => {
        const response = {};
        if (callback) {
            callback(response);
        }
    });

    beforeAll(() => {
        Object.defineProperty(window, 'location', {
            value: { replace: jest.fn() },
        });
    });

    global.chrome = {
        // @ts-ignore
        runtime: {
            // @ts-ignore
            sendMessage: callback,
        },
    };
    jest.spyOn(ChromeCommonUtils, 'writeLocalStorage').mockImplementation(async () => {});
    jest.spyOn(HttpUtils, 'getBrowserInfo').mockReturnValue('Chrome 11.0');

    it('Should get Random Language Message', async () => {
        let message = Common.getRandomLanguageMessage('alertMessage', 0);
        expect(message).toBeTruthy();

        message = Common.getRandomLanguageMessage('alertMessage');
        expect(message).toBeTruthy();

        message = Common.getRandomLanguageMessage('questionChoices');
        expect(message).toBeFalsy();

        message = Common.getRandomLanguageMessage('prr1_screen_continue');
        expect(message).toBeTruthy();
    });

    it('Should close a Tab', async () => {
        let message = 'Ok';
        let siteName = 'google.com';
        let accessLimited = true;

        Common.closeTab(false, message, PrrCategory.EXPLICIT, siteName, accessLimited, PrrLevel.ONE, [], []);

        expect(callback).toBeCalledTimes(0);
    });

    it('Should close a Tab with take me back clicked', async () => {
        let message = 'Ok';
        let siteName = 'google.com';
        let accessLimited = true;
        Common.closeTab(true, message, PrrCategory.EXPLICIT, siteName, accessLimited, PrrLevel.TWO, ['Parent1'], ['message1']);

        expect(callback).toBeCalledTimes(4);
    });

    it('Should ai Take Me Back -> Prr Counter 4', async () => {
        const localStorageManagerGetSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValue(4);
        Common.aiTakeMeBack(true, 'ask', 'SOCIAL_MEDIA_CHAT', 'facebook.com', PrrLevel.ONE);
        expect(localStorageManagerGetSpy).toBeCalledTimes(1);
    });

    it('Should ai Take Me Back -> Prr Level 3', async () => {
        const localStorageManagerGetSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValue(1);
        Common.aiTakeMeBack(true, 'ask', 'SOCIAL_MEDIA_CHAT', 'facebook.com', PrrLevel.THREE);
        expect(localStorageManagerGetSpy).toBeCalledTimes(1);
    });

    it('Should ai Take Me Back -> go previous screen', async () => {
        const localStorageManagerGetSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValue(1);
        Common.aiTakeMeBack(true, 'ask', 'SOCIAL_MEDIA_CHAT', 'facebook.com', PrrLevel.ONE);
        expect(localStorageManagerGetSpy).toBeCalledTimes(1);
    });

    it('Should trigger crisis message', async () => {
        const spy = jest.spyOn(chrome.runtime, 'sendMessage');
        Common.triggerCrisisMessage('guns.com', 'WEAPONS', false);
        expect(spy).toBeCalledTimes(1);
    });

    it('Should get Initial of a name', async () => {
        const message = Common.getInitials('Abc Def');

        expect(message).toEqual('AD');
    });
});
