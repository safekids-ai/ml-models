export type ChromeStorageManager = {
    get: (property: string) => Promise<any>;
    set: (value: any, callback?: () => void) => Promise<void>;
    remove: (property: string, callback?: () => void) => Promise<void>;
};

/**
 * Manages Chrome Local storage
 */
export class LocalStorageManager implements ChromeStorageManager {
    get = async (key: string): Promise<any> => {
        return await new Promise((resolve, reject) => {
            chrome.storage.local.get([key], function (result) {
                resolve(result[key]);
            });
        });
    };

    set = async (value: any, callback?: () => void): Promise<void> => {
        chrome.storage.local.set(value, callback);
    };

    remove = async (key: string, callback?: () => void): Promise<void> => {
        chrome.storage.local.remove(key, callback);
    };
}
