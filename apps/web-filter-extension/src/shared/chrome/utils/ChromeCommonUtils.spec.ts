import { ChromeCommonUtils } from '../../../../src/shared/chrome/utils/ChromeCommonUtils';

describe('ChromeCommonUtils Test', () => {
    const permissibleUrls = ['cnn.com', 'amazon.com', 'youtube.com', 'ixl.com', 'yahoo.com'];
    const shouldBeAllowed = ['cnn.com', 'youtube.com', 'ixl.com'];
    const shouldNotBeAllowed = ['facebook.com', 'twitter.com'];
    it.each(shouldBeAllowed)('Should allow url %s', async (url) => {
        const result = ChromeCommonUtils.isHostPermissibleOrEducational(url, permissibleUrls);
        expect(result).toBeTruthy();
    });

    it.each(shouldNotBeAllowed)('Should not allow url %s', async (url) => {
        const result = ChromeCommonUtils.isHostPermissibleOrEducational(url, permissibleUrls);
        expect(result).toBeFalsy();
    });

    it('Should allow education host', async () => {
        const result = ChromeCommonUtils.isHostPermissibleOrEducational('kahoot.it', []);
        expect(result).toBeTruthy();
    });

    it('Should save value to local storage', async () => {
        const callbackFn = jest.fn(() => {
            Promise.resolve();
        });

        global.chrome = {
            storage: {
                // @ts-ignore
                local: {
                    set: async (value: any, callback): Promise<void> => {
                        if (callback) {
                            callbackFn();
                        }
                    },
                },
            },
        };

        ChromeCommonUtils.writeLocalStorage({ key: 1111 }, callbackFn);
        //then
        expect(callbackFn).toBeCalled();
    });

    it('Should get value from local storage', async () => {
        let result = '11111';
        global.chrome = {
            storage: {
                local: {
                    // @ts-ignore
                    get: async (keys: any, callback: any): Promise<void> => {
                        callback({ key: result });
                    },
                },
            },
        };

        const value = await ChromeCommonUtils.readLocalStorage('key');
        //then
        expect(value).toEqual(result);
    });

    it('Should get User credentials when it found in local storage', async () => {
        const accessCode = '111111';
        const readLocalSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValue({ accessCode: accessCode });
        const result = await ChromeCommonUtils.getUserCredentials();
        expect(result).toMatchObject({ accessCode: accessCode });
        expect(readLocalSpy).toBeCalled();
    });

    it('Should get User credentials when not found', async () => {
        const expected = { accessCode: '' };
        const readLocalSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValue(undefined);
        const result = await ChromeCommonUtils.getUserCredentials();
        expect(readLocalSpy).toBeCalled();
        expect(result).toMatchObject(expected);
    });

    it('Should get Permissible sites when they are found in local storage', async () => {
        const permissibleSites = ['facebook.com', 'instagram.com'];
        const readLocalSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValue(permissibleSites);
        const result = await ChromeCommonUtils.getPermissibleURLs();
        expect(result).toMatchObject(permissibleSites);
        expect(readLocalSpy).toBeCalled();
    });

    it('Should get Permissible sites when not found', async () => {
        const expected: string[] = [];
        const readLocalSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValue(undefined);
        const result = await ChromeCommonUtils.getPermissibleURLs();
        expect(readLocalSpy).toBeCalled();
        expect(result).toMatchObject(expected);
    });

    it('Should get Education Hosts', async () => {
        const result: any = ChromeCommonUtils.getEducationHosts();
        expect(result).toBeTruthy();
        const codes: any = result[0];
        expect(codes.category).toEqual('Education');
        expect(codes.hosts).toBeTruthy();
        expect(codes.hosts['class.com']).toEqual(0);
    });

    it('Should check if code is in educational', async () => {
        const educationCodes = [10280, 10106, 10099, 10101];
        const result = ChromeCommonUtils.inEducationalCodes(educationCodes);
        expect(result).toBeTruthy();
    });

    it('Should check if code not in educational', async () => {
        const educationCodes = [20330];
        const result = ChromeCommonUtils.inEducationalCodes(educationCodes);
        expect(result).toBeFalsy();
    });

    it('Should get jwt token from local storage', async () => {
        const jwtToken = 'jwtToken';
        const readLocalSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValue(jwtToken);
        const result = await ChromeCommonUtils.getJWTToken();
        expect(result).toBe(jwtToken);
        expect(readLocalSpy).toBeCalled();
    });

    it('Should get access Limited Time from local storage', async () => {
        const accessLimitedTime = 'accessLimitedTime';
        const readLocalSpy = jest.spyOn(ChromeCommonUtils, 'readLocalStorage').mockResolvedValue(accessLimitedTime);
        const result = await ChromeCommonUtils.getAccessLimitedTime();
        expect(result).toBe(accessLimitedTime);
        expect(readLocalSpy).toBeCalled();
    });
});
