import { Page } from 'puppeteer';
import { Util } from '../../../../common/Util';
import { Urls } from '../../../../common/Urls';
import { SignInData } from '../../../../data/SignInData';
import { SignInXPaths } from '../../../signin/SignInXPaths';
import { ConsumerPortalXPaths } from '../../../ConsumerPortalXPaths';
import { ProcessesXPaths } from './ProcessesXPaths';
import { ProcessesData } from '../../../../data/ProcessesData';

let util = new Util();
let signInData = new SignInData();
let processesData = new ProcessesData();
let page: Page;

describe('Consumer Portal => Sign In Page', () => {
    beforeEach(async () => {
        page = await util.pageViewPort();
    });

    describe('Processes Flow --> Check UI', () => {
        it(`Check the Kids, process list, enter process input add process button present`, async () => {
            await page.goto(Urls.signInURL, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(2000);
            await util.type(page, SignInXPaths.EMAIL_INPUT, signInData.emailAccount[0]);
            await util.type(page, SignInXPaths.PASSWORD_INPUT, signInData.password[0]);
            await util.clickOn(page, SignInXPaths.SIGN_IN_BUTTON);
            expect(await util.isComponentVisible(page, ConsumerPortalXPaths.SETTINGS_BUTTON)).toBeTruthy();
            await util.clickOn(page, ConsumerPortalXPaths.SETTINGS_BUTTON);
            expect(await util.isComponentVisible(page, ProcessesXPaths.PROCESSES_HEADING)).toBeTruthy();
            expect(await util.isComponentVisible(page, ProcessesXPaths.CHOOSE_FAMILY_TEXT)).toBeTruthy();
            expect(await util.isComponentVisible(page, ProcessesXPaths.SELECTED_KID_INPUT)).toBeTruthy();
            expect(await util.isComponentVisible(page, ProcessesXPaths.LIST)).toBeTruthy();
            expect(await util.isComponentVisible(page, ProcessesXPaths.ENTER_PROCESS_INPUT)).toBeTruthy();
            expect(await util.isComponentVisible(page, ProcessesXPaths.ADD_PROCESS_BUTTON)).toBeTruthy();
        });
    });
});
describe('Processes Flow --> Check add process button is disabled by default ', () => {
    it(`Check add process button is disabled by default `, async () => {
        expect(await util.isComponentVisible(page, ProcessesXPaths.ADD_PROCESS_BUTTON_DISABLE)).toBeTruthy();
    });
});

describe('Processes Flow --> Adding the processes', () => {
    it(`Check ADD process button is enabled `, async () => {
        await util.type(page, ProcessesXPaths.ENTER_PROCESS_INPUT, processesData.names.join(','));
        expect(await util.isComponentVisible(page, ProcessesXPaths.ADD_PROCESS_BUTTON_DISABLE)).toBeFalsy();
    });
});

describe('Processes Flow --> Remove all the processes from ADD processes Input', () => {
    it(`Check ADD process button is disabled`, async () => {
        await util.type(page, ProcessesXPaths.ENTER_PROCESS_INPUT, '');
        expect(await util.isComponentVisible(page, ProcessesXPaths.ADD_PROCESS_BUTTON_DISABLE)).toBeTruthy();
    });
});

describe('Processes Flow --> Check new processes are entering correctly for consumer', () => {
    it(`Check new process are entering correctly for consumer `, async () => {
        await util.type(page, ProcessesXPaths.ENTER_PROCESS_INPUT, processesData.names.join(','));
        expect(await util.isComponentVisible(page, ProcessesXPaths.ADD_PROCESS_BUTTON)).toBeTruthy();
        await util.clickOn(page, ProcessesXPaths.ADD_PROCESS_BUTTON);
        await page.waitForTimeout(3000);
        expect(await util.isComponentVisible(page, ProcessesXPaths.PROCESSES_UPDATED_SUCCESSFULLY)).toBeTruthy();
        processesData.names.forEach((element) => {
            expect(util.isComponentVisible(page, ProcessesXPaths.PROCESS_NAME(element))).toBeTruthy();
        });
    });
});

describe('Processes Flow --> Check newly entered process are deleting correctly for consumer', () => {
    it(`Check newly entered process are deleting correctly for consumer `, async () => {
        await util.clickOn(page, ProcessesXPaths.DELETE_PROCESS_BTN(processesData.names[0]));
        await page.waitForTimeout(500);
        await util.clickOn(page, ProcessesXPaths.DELETE_PROCESS_BTN(processesData.names[1]));
        await page.waitForTimeout(500);
        await util.clickOn(page, ProcessesXPaths.DELETE_PROCESS_BTN(processesData.names[2]));
        await page.waitForTimeout(500);
        expect(util.isComponentVisible(page, ProcessesXPaths.PROCESS_NAME(processesData.names[3]))).toBeTruthy();
    });
});

describe('Processes Flow --> Logout from account ', () => {
    it(`Logout from dashboard %s`, async () => {
        await util.clickOn(page, ConsumerPortalXPaths.LOGOUT_BUTTON);
        await page.close();
    });
});
