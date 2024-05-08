import { AskParentData } from './../../../data/AskParentData';
import { Page } from 'puppeteer';
import { Util } from '../../../common/Util';
import { Urls } from '../../../common/Urls';
import { SignInData } from '../../../data/SignInData';
import { SignInXPaths } from '../../signin/SignInXPaths';
import { ConsumerPortalXPaths } from '../../ConsumerPortalXPaths';
import { ActivityXPaths } from './ActivityXPaths';
import { AxiosResponse } from 'axios';
import { ActivityData } from '../../../data/ActivityData';

let util = new Util();
let signInData = new SignInData();
let activityData = new ActivityData();
let askParentData = new AskParentData();
let page: Page;
let url: string | undefined = process.env.FRONTEND_URL;
let deviceLinkId: string = '';
let jwt_token: string = '';

describe.skip('Consumer Portal => Sign In Page', () => {
    beforeAll(async () => {
        page = await util.pageViewPort();
    });

    describe.skip('Activity Page --> Check Limit access revoke is revoked', () => {
        it(`Goto Activity page and check toast message %s`, async () => {
            await page.goto(Urls.signInURL, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(2000);
            await util.type(page, SignInXPaths.EMAIL_INPUT, signInData.emailAccount[0]);
            await util.type(page, SignInXPaths.PASSWORD_INPUT, signInData.password[0]);
            await util.clickOn(page, SignInXPaths.SIGN_IN_BUTTON);
            expect(await util.isComponentVisible(page, ConsumerPortalXPaths.ACTIVITY_BUTTON)).toBeTruthy();
            await util.clickOn(page, ConsumerPortalXPaths.ACTIVITY_BUTTON);

            let response: AxiosResponse | undefined = await util.getKid();
            let loginKidResponse: AxiosResponse | undefined = await util.loginKid(response?.data[0]?.accessCode);
            await util.setAccessLimited(loginKidResponse?.data?.jwt_token, true, 'SOCIAL_MEDIA_CHAT');
            await page.goto(Urls.signInURL, { waitUntil: 'domcontentloaded' });
            let Url: string = `${url}dashboard?access-request=${loginKidResponse?.data?.jwt_token}`;
            await page.goto(Url, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(2000);
            expect(await util.isComponentVisible(page, ActivityXPaths.ACCESS_LIMIT_CLEARED('Muhammad Muaz'))).toBeTruthy();
            await page.reload();
            await page.waitForTimeout(2000);
            expect(await util.isComponentVisible(page, ActivityXPaths.ACCESS_LIMIT_ALREADY_CLEARED('Muhammad Muaz'))).toBeTruthy();
        });
    });

    describe.skip('Activity Page Flow --> Logout from account', () => {
        it(`Logout from dashboard %s`, async () => {
            await util.clickOn(page, ConsumerPortalXPaths.LOGOUT_BUTTON);
        });
    });

    describe('Activity Page --> Feed ask and inform data to the child 1', () => {
        it(`Enter some of the ask and inform data to child 1 %s`, async () => {
            await page.goto(Urls.signInURL, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(2000);
            await util.type(page, SignInXPaths.EMAIL_INPUT, signInData.emailAccount[0]);
            await util.type(page, SignInXPaths.PASSWORD_INPUT, signInData.password[0]);
            await util.clickOn(page, SignInXPaths.SIGN_IN_BUTTON);
            expect(await util.isComponentVisible(page, ConsumerPortalXPaths.ACTIVITY_BUTTON)).toBeTruthy();
            await util.clickOn(page, ConsumerPortalXPaths.ACTIVITY_BUTTON);
            expect(await util.isComponentVisible(page, ActivityXPaths.NAME_AND_STATUS('Ahmad Khan', 'not connected'))).toBeTruthy();

            let response: AxiosResponse | undefined = await util.getKid();
            let accessCode: string = response?.data[0].lastName === 'Muaz' ? response?.data[0]?.accessCode : response?.data[1]?.accessCode;
            let loginKidResponse: AxiosResponse | undefined = await util.loginKid(accessCode);
            deviceLinkId = loginKidResponse?.data?.link;
            jwt_token = loginKidResponse?.data?.jwt_token;

            activityData.askActivity.userDeviceLinkId = deviceLinkId;
            activityData.informActivity.userDeviceLinkId = deviceLinkId;

            for (let i = 0; i < 3; i++) {
                //put ask data
                activityData.askActivity.activityTime = new Date().toISOString().slice(0, 24);
                await util.activity(jwt_token, activityData.askActivity);
                await page.waitForTimeout(1000);
            }
            for (let i = 0; i < 2; i++) {
                //put inform data
                activityData.informActivity.activityTime = new Date().toISOString().slice(0, 24);
                await util.activity(jwt_token, activityData.informActivity);
                await page.waitForTimeout(1000);
            }
            await page.waitForTimeout(2000);
        });
    });

    describe('Activity Page --> Check UI of activity page for child 1', () => {
        it(`Check buttons, access code present for child 1 %s`, async () => {
            await page.reload();
            await page.waitForTimeout(500);
            expect(await util.isComponentVisible(page, ActivityXPaths.AVATAR('Muhammad Muaz', 'MM'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.NAME_AND_STATUS('Muhammad Muaz', 'connected'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.CHILD_ACCESS_LINK('Muhammad Muaz', 'Show Access Code'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.TOTAL_INTERCEPTS_TEXT('Muhammad Muaz'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.NUMBER_OF_INTERCEPTS('Muhammad Muaz', '5'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.NUMBER_OF_INSTANCES_TEXT('Muhammad Muaz'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.TOP_CATEGORIES_TEXT('Muhammad Muaz'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.TOP_CATEGORIES_NUMBER_SIGN('Muhammad Muaz'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.TRIGGERED_CATEGORY('Muhammad Muaz', 'Social Media and Chat'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.TRIGGERED_NUMBER('Muhammad Muaz', '3'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.TRIGGERED_CATEGORY('Muhammad Muaz', 'Adult Sexual Content'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.TRIGGERED_NUMBER('Muhammad Muaz', '2'))).toBeTruthy();

            await util.clickOn(page, ActivityXPaths.CHILD_ACCESS_LINK('Muhammad Muaz', 'Show Access Code'));
            await page.waitForTimeout(500);
            expect(await util.isComponentVisible(page, ActivityXPaths.CHILD_ACCESS_LINK('Muhammad Muaz', 'Hide Access Code'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.ACCESS_CODE_TEXT('Muhammad Muaz'))).toBeTruthy();
            expect(await util.getNumberOfElements(page, ActivityXPaths.ACCESS_CODE_INPUT('Muhammad Muaz'))).toEqual(6);
            await util.clickOn(page, ActivityXPaths.CHILD_ACCESS_LINK('Muhammad Muaz', 'Hide Access Code'));
            await page.waitForTimeout(500);
        });
    });

    describe('Activity Page --> Feed ask and inform data to the child 2', () => {
        it(`Enter some of the ask and inform data to child 2 %s`, async () => {
            expect(await util.isComponentVisible(page, ActivityXPaths.NAME_AND_STATUS('Ahmad Khan', 'not connected'))).toBeTruthy();
            let response: AxiosResponse | undefined = await util.getKid();
            let accessCode: string = response?.data[1].lastName === 'Khan' ? response?.data[1]?.accessCode : response?.data[0]?.accessCode;
            let loginKidResponse: AxiosResponse | undefined = await util.loginKid(accessCode);
            deviceLinkId = loginKidResponse?.data?.link;
            jwt_token = loginKidResponse?.data?.jwt_token;

            activityData.askActivity.userDeviceLinkId = deviceLinkId;
            activityData.informActivity.userDeviceLinkId = deviceLinkId;

            for (let i = 0; i < 4; i++) {
                //put ask data
                activityData.askActivity.activityTime = new Date().toISOString().slice(0, 24);
                await util.activity(jwt_token, activityData.askActivity);
                await page.waitForTimeout(1000);
            }
            for (let i = 0; i < 4; i++) {
                //put inform data
                activityData.informActivity.activityTime = new Date().toISOString().slice(0, 24);
                await util.activity(jwt_token, activityData.informActivity);
                await page.waitForTimeout(1000);
            }

            await page.waitForTimeout(500);
            await util.askParent(jwt_token, askParentData.askData);

            await page.waitForTimeout(2000);
        });
    });

    describe('Activity Page --> Check UI of activity page for child 2', () => {
        it(`Check buttons, access code present for child 2 %s`, async () => {
            await page.reload();
            await page.waitForTimeout(5000);
            expect(await util.isComponentVisible(page, ActivityXPaths.AVATAR('Ahmad Khan', 'AK'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.NAME_AND_STATUS('Ahmad Khan', 'connected'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.CHILD_ACCESS_LINK('Ahmad Khan', 'Show Access Code'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.TOTAL_INTERCEPTS_TEXT('Ahmad Khan'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.NUMBER_OF_INTERCEPTS('Ahmad Khan', '8'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.NUMBER_OF_INSTANCES_TEXT('Ahmad Khan'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.TOP_CATEGORIES_TEXT('Ahmad Khan'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.TOP_CATEGORIES_NUMBER_SIGN('Ahmad Khan'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.TRIGGERED_CATEGORY('Ahmad Khan', 'Social Media and Chat'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.TRIGGERED_NUMBER('Ahmad Khan', '4'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.TRIGGERED_CATEGORY('Ahmad Khan', 'Adult Sexual Content'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.TRIGGERED_NUMBER('Ahmad Khan', '4'))).toBeTruthy();

            await util.clickOn(page, ActivityXPaths.CHILD_ACCESS_LINK('Ahmad Khan', 'Show Access Code'));
            await page.waitForTimeout(500);
            expect(await util.isComponentVisible(page, ActivityXPaths.CHILD_ACCESS_LINK('Ahmad Khan', 'Hide Access Code'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.ACCESS_CODE_TEXT('Ahmad Khan'))).toBeTruthy();
            expect(await util.getNumberOfElements(page, ActivityXPaths.ACCESS_CODE_INPUT('Ahmad Khan'))).toEqual(6);
            await util.clickOn(page, ActivityXPaths.CHILD_ACCESS_LINK('Ahmad Khan', 'Hide Access Code'));
            await page.waitForTimeout(500);
        });
    });

    describe('Activity Page --> Check UI of ask container for child 2', () => {
        it(`Check Ask requests for child 2 %s`, async () => {
            expect(await util.isComponentVisible(page, ActivityXPaths.ASK_FOR_ACCESS_TITLE('Ahmad Khan'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.ASK_FOR_ACCESS_URL_INPUT('Ahmad Khan', 'https://www.facebook.com'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.ASK_FOR_ACCESS_URL('Ahmad Khan', 'https://www.facebook.com'))).toBeTruthy();
            expect(await util.isComponentVisible(page, ActivityXPaths.ASK_FOR_ACCESS_DISABLE_ADD_BUTTON('Ahmad Khan'))).toBeTruthy();
            await util.clickOn(page, ActivityXPaths.ASK_FOR_ACCESS_URL_INPUT('Ahmad Khan', 'https://www.facebook.com'));
            await page.waitForTimeout(2000);
            expect(await util.isComponentVisible(page, ActivityXPaths.ASK_FOR_ACCESS_ENABLED_ADD_BUTTON('Ahmad Khan'))).toBeTruthy();
            await page.waitForTimeout(500);
            await util.clickOn(page, ActivityXPaths.ASK_FOR_ACCESS_ENABLED_ADD_BUTTON('Ahmad Khan'));
            await page.waitForTimeout(1500);
            expect(await util.isComponentVisible(page, ActivityXPaths.ASK_FOR_ACCESS_URL_INPUT('Ahmad Khan', 'https://www.facebook.com'))).toBeFalsy();
            expect(await util.isComponentVisible(page, ActivityXPaths.ASK_FOR_ACCESS_URL('Ahmad Khan', 'https://www.facebook.com'))).toBeFalsy();
        });
    });

    describe('Activity Page Flow --> Logout from account', () => {
        it(`Logout from dashboard %s`, async () => {
            await util.clickOn(page, ConsumerPortalXPaths.LOGOUT_BUTTON);
            await page.close();
        });
    });
});
