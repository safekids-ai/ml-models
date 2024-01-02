export interface IChromeStorage {
    get(key: string) : Promise<string | undefined>;
    set(key: string, val: string) : Promise<void>;
}

export class ChromeStorageV2 implements IChromeStorage {
    async get(key: string) : Promise<string | undefined> {
        return new Promise(resolve => {
            chrome.storage.sync.get(key, (keyObject => {
                if (!keyObject) {
                    return resolve(undefined);
                }
                return resolve(keyObject[key]);
            }));
        });
    }

    async set(key: string, val: string) : Promise<void> {
        await chrome.storage.sync.set({[key]: val});
    }
}

export class ChromeStorageV3 implements IChromeStorage {
    async get(key: string) : Promise<string | undefined> {
        let keyObject = await chrome.storage.sync.get(key);
        if (!keyObject) {
            return undefined;
        }
        return keyObject[key];
    }

    async set(key: string, val: string) : Promise<void> {
        await chrome.storage.sync.set({[key]: val});
    }
}

export class ChromeStorageFactory {
    private static instance: IChromeStorage;

    public static manifestV2() : IChromeStorage {
        if (ChromeStorageFactory.instance == null) {
            ChromeStorageFactory.instance = new ChromeStorageV2();
        }
        return ChromeStorageFactory.instance;
    }

    public static manifestV3() : IChromeStorage {
        if (ChromeStorageFactory.instance == null) {
            ChromeStorageFactory.instance = new ChromeStorageV3();
        }
        return ChromeStorageFactory.instance;
    }
}
