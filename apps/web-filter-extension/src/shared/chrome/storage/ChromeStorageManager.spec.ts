import { LocalStorageManager } from '../../../../src/shared/chrome/storage/ChromeStorageManager';

describe('LocalStorageManager Test', () => {
    let localStorage: LocalStorageManager;

    beforeEach(() => {
        localStorage = new LocalStorageManager();
    });

    it('Should save value to storage', async () => {
        global.chrome = {
            storage: {
                // @ts-ignore
                local: {
                    set: async (value: any, callback): Promise<void> => {
                        if (callback) {
                            callback();
                        }
                    },
                },
            },
        };

        const callback = jest.fn(() => {
            Promise.resolve();
        });

        await localStorage.set({ key: 1111 }, callback);

        //then
        expect(callback).toBeCalled();
    });

    it('Should remove value from storage', async () => {
        global.chrome = {
            storage: {
                // @ts-ignore
                local: {
                    remove: async (value: any, callback): Promise<void> => {
                        if (callback) {
                            callback();
                        }
                    },
                },
            },
        };

        const callback = jest.fn(() => {
            Promise.resolve();
        });

        await localStorage.remove('key', callback);

        //then
        expect(callback).toBeCalled();
    });

    it('Should get value from storage', async () => {
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

        let value = await localStorage.get('key');

        expect(value).toEqual(result);
    });
});
