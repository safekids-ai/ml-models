import { Page } from 'puppeteer';
import axios, { AxiosResponse } from 'axios';
import { DELETE_AN_ACCOUNT, LOGIN, CONSUMER_KID } from '../../../src/utils/endpoints';

/** Verify PRR model is triggered or not
 * @param  {} page
 * @param  {} cssSelector
 * @param  {} scroll
 */
declare var global: any;
export class Util {
    private backendURL: string | undefined = process.env.BACKEND_URL;
    private loginResponse: AxiosResponse<any> | undefined;
    private loginKidResponse: AxiosResponse<any> | undefined;

    pageViewPort = async () => {
        const page = await global.__BROWSER__.newPage();
        await page.setViewport({
            width: 1840,
            height: 1020,
        });
        return page;
    };

    autoScroll = async (page: Page) => {
        await page.evaluate(async () => {
            await new Promise<void>((resolve, reject) => {
                let totalHeight = 0;
                let distance = 100;
                let timer = setInterval(() => {
                    let scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        });
    };

    scrollToBottom = async (page: Page) => {
        await page.evaluate(() => {
            window.scrollTo(0, window.document.body.scrollHeight);
        });
    };

    // openLink = async (page: Page, selector: string): Promise<Page> => {
    //     //save target of original page to know that this was the opener:
    //     if (!page) {
    //         throw new Error('Page does not exist while calling testPopupUrl');
    //     }
    //     const pageTarget = page.target();
    //     //execute click on first tab that triggers opening of new tab:
    //     await page.waitForXPath(selector);
    //     const element = await page.$x(selector);
    //     await element[0].click();
    //     //check that the first page opened this new page:
    //     const newTarget: Target = await global.__BROWSER__.waitForTarget((target) => target.opener() === pageTarget);
    //     //get the new page object:
    //     const page1: Page = await newTarget.page();
    //     if (!page1) {
    //         throw new Error('new target page was null');
    //     }
    //     return page1;
    // };

    isComponentVisible = async (page: Page, selector: string, waitTime?: number | undefined, scroll?: boolean): Promise<boolean> => {
        let visible = true;
        let wait: number | undefined;
        if (waitTime == undefined) {
            wait = 5000;
        } else {
            wait = waitTime;
        }
        await page
            .waitForXPath(selector, { visible: true, timeout: wait })
            .then(async () => {
                if (scroll) {
                    await page.evaluate(() => {
                        window.scrollTo(0, window.document.body.scrollHeight);
                    });
                }
            })
            .catch(() => {
                visible = false;
            });
        return visible;
    };

    isChecked = async (page: Page, selector: string): Promise<any> => {
        let checkboxChecked: boolean = false;
        await page
            .waitForXPath(selector, { visible: true, timeout: 5000 })
            .then(async () => {
                const checkBox = await page.$x(selector);
                checkboxChecked = await (await checkBox[0].getProperty('checked')).jsonValue();
            })
            .catch(() => {
                console.log('Checkbox not present');
                return undefined;
            });
        return checkboxChecked;
    };

    typeF = async (page: Page, selector: string, term: string): Promise<void> => {
        await page
            .waitForXPath(selector, { visible: true, timeout: 5000 })
            .then(async () => {
                const inputField = await page.$x(selector);
                await inputField[0].click({ clickCount: 1 });
                await inputField[0].type(term, { delay: 20 });
            })
            .catch(() => {
                console.log('Field not present');
            });
    };

    type = async (page: Page, selector: string, term: string): Promise<void> => {
        await page
            .waitForXPath(selector, { visible: true, timeout: 5000 })
            .then(async () => {
                const inputField = await page.$x(selector);
                await inputField[0].click({ clickCount: 3 });
                await inputField[0].press('Backspace');
                await inputField[0].type(term, { delay: 20 });
            })
            .catch(() => {
                console.log('Field not present');
            });
    };

    getTextValue = async (page: Page, selector: string, scroll?: boolean): Promise<string> => {
        let textValue: string = '';
        await page
            .waitForXPath(selector, { visible: true, timeout: 2000 })
            .then(async () => {
                const element = await page.$x(selector);
                const textObject = await element[0].getProperty('textContent');
                textValue = textObject._remoteObject.value;
            })
            .catch(() => {
                textValue = 'Null';
            });
        return textValue;
    };

    getTextValueInputField = async (page: Page, selector: string, scroll?: boolean): Promise<string> => {
        let textValue: string = '';
        await page
            .waitForXPath(selector, { visible: true, timeout: 2000 })
            .then(async () => {
                const element = await page.$x(selector);
                const textObject = await element[0].getProperty('value');
                textValue = textObject._remoteObject.value;
            })
            .catch(() => {
                textValue = 'Null';
            });
        return textValue;
    };

    getNumberOfElements = async (page: Page, selector: string, scroll?: boolean): Promise<number> => {
        let textValue: number = 0;
        await page
            .waitForXPath(selector, { visible: true, timeout: 2000 })
            .then(async () => {
                const element = await page.$x(selector);
                textValue = element.length;
            })
            .catch(() => {
                textValue = NaN;
            });
        return textValue;
    };

    clickOn = async (page: Page, selector: string, scroll?: boolean) => {
        let flag = 'NotClicked';
        await page
            .waitForXPath(selector, { visible: true, timeout: 2000 })
            .then(async () => {
                const element = await page.$x(selector);
                await element[0].click();
                flag = 'clicked';
            })
            .catch(() => {
                flag = 'element not found';
            });
        return flag;
    };

    loginUser = async (email: String, password: String) => {
        let url: string = `${this.backendURL}${LOGIN}`;
        console.log('Getting Token');
        let payload = { email, password };
        try {
            return await axios.post(url, payload);
        } catch (e) {
            console.log('The error occurs while posting the request', e);
        }
    };

    getKid = async () => {
        this.loginResponse = await this.loginUser('uzair@gmail.com', 'S@feKids1');
        let url: string = `${this.backendURL}${CONSUMER_KID}`;
        let config = {
            headers: {
                Authorization: `Bearer ${this.loginResponse?.data?.jwt_token}`,
            },
        };
        try {
            return await axios.get(url, config);
        } catch (e) {
            console.log('The error occurs while posting the request', e);
        }
    };

    loginKid = async (accessCode: string) => {
        let url: string = `${this.backendURL}v2/chrome/consumer/auth/login`;
        console.log('Entered in function');
        console.log('The code is ', accessCode);
        let payload = { accessCode: `${accessCode}`, directoryApiId: `${accessCode}`, deviceType: 'Normal', deviceName: 'undefined-Normal' };

        try {
            let response = await axios.post(url, payload);
            return response;
        } catch (e) {
            console.log('The error occurs while posting the request', e);
        }
    };

    setAccessLimited = async (jwt_token: string, value: boolean, category: string) => {
        let url: string = `${this.backendURL}v2/chrome/consumer/api/users/accesslimited`;
        let data = {
            accessLimited: value,
            category: category,
        };
        let config = {
            headers: {
                Authorization: `Bearer ${jwt_token}`,
            },
        };
        await axios
            .patch(url, data, config)
            .then(function (response: any) {
                console.log('The response is ', response);
            })
            .catch(function (error: any) {
                console.log(error);
            });
    };

    activity = async (jwt_token: string, payload: any) => {
        //     this.loginKidResponse = await this.loginKid(accessCode);
        let url: string = `${this.backendURL}v2/chrome/api/webusage/activities`;
        //    let userDeviceLinkId: string = `${this.loginKidResponse?.data?.link}`;

        let config = {
            headers: {
                Authorization: `Bearer ${jwt_token}`,
            },
        };
        try {
            return await axios.post(url, payload, config);
        } catch (e) {
            console.log('The error occurs while posting the request', e);
        }
    };

    askParent = async (jwt_token: string, payload: any) => {
        let url: string = `${this.backendURL}v2/chrome/consumer/ask-parent`;

        let config = {
            headers: {
                Authorization: `Bearer ${jwt_token}`,
            },
        };
        try {
            return await axios.post(url, payload, config);
        } catch (e) {
            console.log('The error occurs while posting the request', e);
        }
    };

    deleteAccount = async (email: string, password: string) => {
        this.loginResponse = await this.loginUser(email, password);
        console.log('The Token is -----', `${this.loginResponse?.data?.jwt_token}`);
        let url: string = `${this.backendURL}${DELETE_AN_ACCOUNT}`;
        console.log('Deleting Account');
        await axios
            .request({
                headers: {
                    Authorization: `Bearer ${this.loginResponse?.data?.jwt_token}`,
                },
                method: 'delete',
                url,
                data: { email },
            })
            .then(function (response: any) {
                console.log('Account deleted ', response.data);
            })
            .catch(function (error: any) {
                console.log(error);
            });
    };
}
