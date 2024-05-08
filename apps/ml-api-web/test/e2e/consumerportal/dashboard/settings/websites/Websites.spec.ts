import { Page } from 'puppeteer';
import { Util } from '../../../../common/Util';
import { Urls } from '../../../../common/Urls';
import { SignInData } from '../../../../data/SignInData';
import { SignInXPaths } from '../../../signin/SignInXPaths';
import { ConsumerPortalXPaths } from '../../../ConsumerPortalXPaths';
import { WebsitesXPaths } from './WebsitesXPaths';
import { WebsiteData } from '../../../../data/WebsitesData';

let util = new Util();
let signInData = new SignInData();
let websitesData = new WebsiteData();
let page: Page;

describe('Consumer Portal => Sign In Page', () => {
    beforeEach(async () => {
        page = await util.pageViewPort();
    });

    describe('Websites Flow --> Check UI', () => {
        it(`Check the Kids, website list, enter website input add site button present`, async () => {
            await page.goto(Urls.signInURL, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(2000);
            await util.type(page, SignInXPaths.EMAIL_INPUT, signInData.emailAccount[0]);
            await util.type(page, SignInXPaths.PASSWORD_INPUT, signInData.password[0]);
            await util.clickOn(page, SignInXPaths.SIGN_IN_BUTTON);
            expect(await util.isComponentVisible(page, ConsumerPortalXPaths.SETTINGS_BUTTON)).toBeTruthy();
            await util.clickOn(page, ConsumerPortalXPaths.SETTINGS_BUTTON);
            expect(await util.isComponentVisible(page, WebsitesXPaths.WEBSITES_HEADING)).toBeTruthy();
            expect(await util.isComponentVisible(page, WebsitesXPaths.CHOOSE_FAMILY_TEXT)).toBeTruthy();
            expect(await util.isComponentVisible(page, WebsitesXPaths.SELECTED_KID_INPUT)).toBeTruthy();
            expect(await util.isComponentVisible(page, WebsitesXPaths.LIST)).toBeTruthy();
            expect(await util.isComponentVisible(page, WebsitesXPaths.ENTER_WEBSITE_INPUT)).toBeTruthy();
            expect(await util.isComponentVisible(page, WebsitesXPaths.ADD_WEBSITE_BUTTON)).toBeTruthy();
        });
    });
});
describe('Websites Flow --> Check add site button is disabled by default ', () => {
    it(`Check add site button is disabled by default `, async () => {
        expect(await util.isComponentVisible(page, WebsitesXPaths.ADD_WEBSITE_BUTTON_DISABLE)).toBeTruthy();
    });
});

describe('Websites Flow --> Adding the websites', () => {
    it(`Check ADD Websites button is enabled `, async () => {
        await util.type(page, WebsitesXPaths.ENTER_WEBSITE_INPUT, websitesData.addWebsites.join(','));
        expect(await util.isComponentVisible(page, WebsitesXPaths.ADD_WEBSITE_BUTTON_DISABLE)).toBeFalsy();
    });
});

describe('Websites Flow --> Remove all the sites from ADD Sites Input', () => {
    it(`Check ADD Websites button is disabled`, async () => {
        await util.type(page, WebsitesXPaths.ENTER_WEBSITE_INPUT, '');
        expect(await util.isComponentVisible(page, WebsitesXPaths.ADD_WEBSITE_BUTTON_DISABLE)).toBeTruthy();
    });
});

describe('Websites Flow --> Check new websites are entering correctly for consumer', () => {
    it(`Check new websites are entering correctly for consumer `, async () => {
        await util.type(page, WebsitesXPaths.ENTER_WEBSITE_INPUT, websitesData.addWebsites.join(','));
        expect(await util.isComponentVisible(page, WebsitesXPaths.ADD_WEBSITE_BUTTON)).toBeTruthy();
        await util.clickOn(page, WebsitesXPaths.ADD_WEBSITE_BUTTON);
        await page.waitForTimeout(3000);
        expect(await util.isComponentVisible(page, WebsitesXPaths.WEBSITES_UPDATED_SUCCESSFULLY)).toBeTruthy();
        websitesData.trimDownWebsites.forEach((element) => {
            expect(util.isComponentVisible(page, WebsitesXPaths.WEBSITE_URL(element))).toBeTruthy();
        });
    });
});

describe('Websites Flow --> Check newly entered websites are deleting correctly for consumer', () => {
    it(`Check newly entered websites are deleting correctly for consumer `, async () => {
        await util.clickOn(page, WebsitesXPaths.DELETE_URL_BTN(websitesData.trimDownWebsites[0]));
        await page.waitForTimeout(500);
        await util.clickOn(page, WebsitesXPaths.DELETE_URL_BTN(websitesData.trimDownWebsites[1]));
        await page.waitForTimeout(500);
        await util.clickOn(page, WebsitesXPaths.DELETE_URL_BTN(websitesData.trimDownWebsites[2]));
        await page.waitForTimeout(500);
        expect(util.isComponentVisible(page, WebsitesXPaths.WEBSITE_URL(websitesData.trimDownWebsites[3]))).toBeTruthy();
    });
});

describe('Websites Flow --> Logout from account ', () => {
    it(`Logout from dashboard %s`, async () => {
        await util.clickOn(page, ConsumerPortalXPaths.LOGOUT_BUTTON);
        await page.close();
    });
});
