import { Page } from 'puppeteer';
import { Util } from '../../common/Util';
import { Urls } from '../../common/Urls';
import { CommonXPaths } from '../../common/CommonXPaths';
import { ForgotPasswordXPaths } from './ForgotPasswordXPaths';
import { ForgotPasswordData } from '../../data/ForgotPasswordData';
import { SignInXPaths } from '../signin/SignInXPaths';

let util = new Util();
let forgotPasswordData = new ForgotPasswordData();
let page: Page;

describe('Consumer Portal => Forgot Password Page', () => {
    beforeEach(async () => {
        page = await util.pageViewPort();
    });

    describe('Forgot Password Flow --> Check UI', () => {
        it(`Check Logo, Buttons, input field, and text present %s`, async () => {
            await page.goto(Urls.signInURL, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(2000);
            await util.clickOn(page, SignInXPaths.CLICK_HERE_BUTTON);
            await page.waitForTimeout(2000);
            expect(await util.isComponentVisible(page, CommonXPaths.SAFEKIDS_LOGO)).toBeTruthy();
            expect(await util.isComponentVisible(page, CommonXPaths.SAFEKIDS_IMAGE)).toBeTruthy();
            expect(await util.isComponentVisible(page, ForgotPasswordXPaths.BACK_BUTTON)).toBeTruthy();
            expect(await util.isComponentVisible(page, ForgotPasswordXPaths.FORGOT_PASSWORD_TEXT)).toBeTruthy();
            expect(await util.isComponentVisible(page, ForgotPasswordXPaths.EMAIL_INPUT)).toBeTruthy();
            expect(await util.isComponentVisible(page, ForgotPasswordXPaths.SUBMIT_BUTTON)).toBeTruthy();
            expect(await util.isComponentVisible(page, CommonXPaths.ALL_RIGHTS_RESERVED_TEXT)).toBeTruthy();
        });
    });
});

describe('Forgot Password Flow --> Enter Invalid Email', () => {
    it(`Enter invalid email should not enable the Submit button %s`, async () => {
        await util.type(page, ForgotPasswordXPaths.EMAIL_INPUT, forgotPasswordData.emailAccount[1]);
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.SUBMIT_DISABLED_BUTTON)).toBeTruthy();
    
    });
});

describe('Forgot Password Flow --> Enter Wrong Email', () => {
    it(`Enter wrong email should show toast message of user with email: does not exists. %s`, async () => {
        await util.type(page, ForgotPasswordXPaths.EMAIL_INPUT, forgotPasswordData.emailAccount[2]);
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.SUBMIT_BUTTON)).toBeTruthy();
        await util.clickOn(page, ForgotPasswordXPaths.SUBMIT_BUTTON);
        expect(
            await util.isComponentVisible(
                page,
                ForgotPasswordXPaths.TOAST_MESSAGE_PART1 + forgotPasswordData.emailAccount[2] + ForgotPasswordXPaths.TOAST_MESSAGE_PART2,
            ),
        ).toBeTruthy();
    });
});

describe('Forgot Password Flow --> Enter Correct Email', () => {
    it(`Enter Email and press submit button %s`, async () => {
        await util.type(page, ForgotPasswordXPaths.EMAIL_INPUT, forgotPasswordData.emailAccount[0]);
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.SUBMIT_BUTTON)).toBeTruthy();
        await util.clickOn(page, ForgotPasswordXPaths.SUBMIT_BUTTON);
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.SIX_DIGIT_CODE, 15000)).toBeTruthy();
    });
});

describe('Forgot Password Flow --> Check the 6 digit code input, button and text present ', () => {
    it(`Check text, button and input field present %s`, async () => {
        expect(await util.isComponentVisible(page, CommonXPaths.SAFEKIDS_LOGO)).toBeTruthy();
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.BACK_BUTTON)).toBeTruthy();
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.FORGOT_PASSWORD_TEXT)).toBeTruthy();
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.LETS_GET_YOU_BACK_TEXT)).toBeTruthy();
        expect(await util.getNumberOfElements(page, ForgotPasswordXPaths.SIX_DIGIT_CODE)).toEqual(6);
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.SUBMIT_DISABLED_BUTTON)).toBeTruthy();
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.HAVENT_RECEIVE_EMAIL_TEXT)).toBeTruthy();
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.RESEND_BUTTON)).toBeTruthy();
        expect(await util.isComponentVisible(page, CommonXPaths.ALL_RIGHTS_RESERVED_TEXT)).toBeTruthy();
    });
});

describe('Forgot Password Flow --> Enter 5 digits in the 6 digit code ', () => {
    it(`check the submit button is disabled %s`, async () => {
        const element = await page.$x(ForgotPasswordXPaths.SIX_DIGIT_CODE);
        for (let i = 0; i < element.length - 1; i++) {
            await element[i].type('2');
        }
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.SUBMIT_DISABLED_BUTTON)).toBeTruthy();
    });
});

describe('Forgot Password Flow --> Enter 6 digits wrong code ', () => {
    it(`check the invalid code message appear and on clicking submit, nothing happens %s`, async () => {
        const element = await page.$x(ForgotPasswordXPaths.SIX_DIGIT_CODE);
        for (let i = 0; i < element.length; i++) {
            await element[i].type('2');
        }
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.TOAST_MESSAGE_INVALID_CODE)).toBeTruthy();
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.SUBMIT_DISABLED_BUTTON)).toBeFalsy();
        await util.clickOn(page, ForgotPasswordXPaths.SUBMIT_BUTTON);
        await page.waitForTimeout(2000);
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.SIX_DIGIT_CODE)).toBeTruthy(); // check on the same page
    });
});

describe('Forgot Password Flow --> Enter correct 6 digits ', () => {
    it(`check the submit button is enabled and on clicking, taken to change password screen %s`, async () => {
        const element = await page.$x(ForgotPasswordXPaths.SIX_DIGIT_CODE);
        for (let i = 0; i < element.length; i++) {
            await element[i].type('1');
        }
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.CREATE_NEW_PASSWORD_TEXT, 15000)).toBeTruthy();
    });
});

describe('Forgot Password Flow --> Create New Password Screen ', () => {
    it(`check the create password input, text and buttons are present %s`, async () => {
        expect(await util.isComponentVisible(page, CommonXPaths.SAFEKIDS_LOGO)).toBeTruthy();
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.CHOOSE_EIGHT_CHARACTER_PASSWORD_TEXT)).toBeTruthy();
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.HIDDEN_PASSWORD_INPUT_FIELD)).toBeTruthy();
        expect(await util.getNumberOfElements(page, ForgotPasswordXPaths.PASSWORD_STRENGTH_BAR)).toEqual(8);
        await util.type(page, ForgotPasswordXPaths.HIDDEN_PASSWORD_INPUT_FIELD, 'uz');
        expect(await util.getNumberOfElements(page, ForgotPasswordXPaths.PASSWORD_STRENGTH_BAR)).toEqual(6);
        expect(await util.getNumberOfElements(page, ForgotPasswordXPaths.COLORED_PASSWORD_STRENGTH_BAR)).toEqual(2);
        await util.clickOn(page, ForgotPasswordXPaths.EYE_ICON);
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.UNHIDDEN_PASSWORD_INPUT_FIELD)).toBeTruthy();
        await util.clickOn(page, ForgotPasswordXPaths.EYE_ICON);
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.SUBMIT_DISABLED_BUTTON)).toBeTruthy();
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.EYE_ICON)).toBeTruthy();
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.I_ICON)).toBeTruthy();
        expect(await util.isComponentVisible(page, CommonXPaths.ALL_RIGHTS_RESERVED_TEXT)).toBeTruthy();
        await util.type(page, ForgotPasswordXPaths.HIDDEN_PASSWORD_INPUT_FIELD, ' '); //wrong format check
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.WRONG_FORMAT_PASSWORD_TOAST_MESSAGE)).toBeTruthy();
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.WRONG_FORMAT_PASSWORD_TOAST_MESSAGE_2)).toBeTruthy();
        await util.type(page, ForgotPasswordXPaths.HIDDEN_PASSWORD_INPUT_FIELD, '');
        await page.waitForTimeout(500);
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.WRONG_FORMAT_PASSWORD_TOAST_MESSAGE)).toBeFalsy();
    });
});

describe('Forgot Password Flow --> Enter correct password ', () => {
    it(`click submit button, is should take you back to signin screen %s`, async () => {
        await util.type(page, ForgotPasswordXPaths.HIDDEN_PASSWORD_INPUT_FIELD, forgotPasswordData.password[0]);
        expect(await util.getNumberOfElements(page, ForgotPasswordXPaths.COLORED_PASSWORD_STRENGTH_BAR)).toEqual(8);
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.SUBMIT_DISABLED_BUTTON)).toBeFalsy();
        await util.clickOn(page, ForgotPasswordXPaths.SUBMIT_BUTTON);
        expect(await util.isComponentVisible(page, SignInXPaths.SIGN_IN_TEXT)).toBeTruthy();
        await page.close();
    });
});
