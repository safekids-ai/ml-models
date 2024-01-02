/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import Tab = chrome.tabs.Tab;

export type OptIn = {
    emailOptInSelection?: boolean;
    onboardingDone?: boolean| undefined;
    onboardingTime?: Date| undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const readLocalStorage = async (key: string): Promise<any> => {
    return await new Promise((resolve) => {
        chrome.storage.local.get([key], function (result) {
            resolve(result[key])
        })
    })
}

export const writeToLocalStorage = async (value: any, callback?: () => void): Promise<void> => {
    chrome.storage.local.set(value, function () {
        if (callback) {
            callback();
        }
    });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const promiseChrome = async (callback: any): Promise<any> => {
    return await new Promise((resolve) => {
        callback(resolve)
    })
}

export const getOnBoardingPage = () : string => {
    return 'chrome-extension://' + chrome.runtime.id + '/ui-onboarding/index.html'
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendMessage = async (message: any): Promise<any> => {
    return await new Promise((resolve) => {
        chrome.runtime.sendMessage(message, function (result) {
            resolve(result)
        })
    })
}

export function closeTab (tab: Tab): void {
    if (tab.id) {
        chrome.tabs.remove(tab.id);
    }
}

export function closeOnBoardingTab (): void {
    const onBoardingPage = getOnBoardingPage()
    chrome.tabs.query({}, async function (tabs) {
        for (let i = 0; i < tabs.length; i++) {
            const tabUrl = tabs[i]?.url;
            if (tabUrl && tabUrl.startsWith(onBoardingPage)) {
                const tabId = tabs[i].id;
                if (tabId) {
                    await chrome.tabs.remove(tabId)
                }
                break
            }
        }
    })
}

export const redirectTab = async (url: string) : Promise<void> => {
    let counter = 0
    chrome.tabs.query({}, function (tabs) {
        for (let i = 0; i < tabs.length; i++) {
            const tabUrl = tabs[i]?.url;
            if (tabUrl && tabUrl.startsWith(url)) {
                counter++
                break
            }
        }
        if(counter == 0){
            chrome.tabs.create({
                url
            })
        }
    })
}

export const getJWTToken = async () => {
    const jwtToken = await readLocalStorage('jwtToken')
    return jwtToken
}

