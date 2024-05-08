import { Page } from 'puppeteer';
import { Util } from '../../common/Util';
import { Urls } from '../../common/Urls';
import { SignInData } from '../../data/SignInData';
import { SignInXPaths } from './SignInXPaths';
import { ForgotPasswordXPaths } from '../forgotpassword/ForgotPasswordXPaths';
import { SignUpXPaths } from '../signup/SignUpXPaths';
import { ConsumerPortalXPaths } from '../ConsumerPortalXPaths';
import { CommonXPaths } from '../../common/CommonXPaths';

let util = new Util();
let signInData = new SignInData();
let page: Page;

describe('Consumer Portal => Sign In Page', () => {
    beforeEach(async () => {
        page = await util.pageViewPort();
    });

    describe('SignIn Flow --> Check UI', () => {
        it(`Check Logo, Buttons, input fields, and text present %s`, async () => {
            await page.goto(Urls.signInURL, { waitUntil: 'domcontentloaded' });
            expect(await util.isComponentVisible(page, CommonXPaths.SAFEKIDS_LOGO)).toBeTruthy();
            expect(await util.isComponentVisible(page, CommonXPaths.SAFEKIDS_IMAGE)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignInXPaths.SIGN_IN_TEXT)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignInXPaths.DONT_HAVE_ACCOUNT_TEXT)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignInXPaths.SIGN_UP_BUTTON)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignInXPaths.EMAIL_INPUT)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignInXPaths.PASSWORD_INPUT)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignInXPaths.EYE_ICON)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignInXPaths.SIGN_IN_DISABLED_BUTTON)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignInXPaths.FORGOT_PASSWORD_TEXT)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignInXPaths.CLICK_HERE_BUTTON)).toBeTruthy();
            expect(await util.isComponentVisible(page, CommonXPaths.ALL_RIGHTS_RESERVED_TEXT)).toBeTruthy();
        });
    });
});

describe('SignIn Flow --> Click Forgot Password "Click Here"', () => {
    it(`Check forgot password page is displayed and get back to sign in page %s`, async () => {
        await util.clickOn(page, SignInXPaths.CLICK_HERE_BUTTON);
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.FORGOT_PASSWORD_TEXT, 15000)).toBeTruthy();
        expect(await util.isComponentVisible(page, ForgotPasswordXPaths.BACK_BUTTON)).toBeTruthy();
        await util.clickOn(page, ForgotPasswordXPaths.BACK_BUTTON);
        expect(await util.isComponentVisible(page, SignInXPaths.SIGN_IN_TEXT)).toBeTruthy();
        expect(await util.isComponentVisible(page, SignInXPaths.DONT_HAVE_ACCOUNT_TEXT)).toBeTruthy();
        expect(await util.isComponentVisible(page, SignInXPaths.SIGN_UP_BUTTON)).toBeTruthy();
    });
});

describe('SignIn Flow --> Click "Sign Up"', () => {
    it(`Check sign Up page is displayed and get back to sign in page %s`, async () => {
        await util.clickOn(page, SignInXPaths.SIGN_UP_BUTTON);
        expect(await util.isComponentVisible(page, SignUpXPaths.CREATE_AN_ACCOUNT_TEXT, 15000)).toBeTruthy();
        expect(await util.isComponentVisible(page, SignUpXPaths.ALREADY_HAVE_AN_ACCOUNT_TEXT)).toBeTruthy();
        expect(await util.isComponentVisible(page, SignUpXPaths.SIGN_IN_BUTTON)).toBeTruthy();
        await util.clickOn(page, SignUpXPaths.SIGN_IN_BUTTON);
        expect(await util.isComponentVisible(page, SignInXPaths.SIGN_IN_TEXT)).toBeTruthy();
        expect(await util.isComponentVisible(page, SignInXPaths.DONT_HAVE_ACCOUNT_TEXT)).toBeTruthy();
        expect(await util.isComponentVisible(page, SignInXPaths.SIGN_UP_BUTTON)).toBeTruthy();
    });
});

describe('SignIn Flow --> Enter Wrong Credentials', () => {
    it(`Enter wrong email should show toast message of invalid credentials%s`, async () => {
        await util.type(page, SignInXPaths.EMAIL_INPUT, signInData.emailAccount[1]);
        await util.type(page, SignInXPaths.PASSWORD_INPUT, signInData.password[0]);
        expect(await util.isComponentVisible(page, SignInXPaths.SIGN_IN_BUTTON)).toBeTruthy();
        await util.clickOn(page, SignInXPaths.SIGN_IN_BUTTON);
        expect(await util.isComponentVisible(page, SignInXPaths.INVALID_CREDENTIALS_TOAST_MESSAGE)).toBeTruthy();
    });
});

describe('SignIn Flow --> Enter Invalid Email', () => {
    it(`Enter invalid email should not enable the Sign In button %s`, async () => {
        await util.type(page, SignInXPaths.EMAIL_INPUT, signInData.emailAccount[2]);
        await util.type(page, SignInXPaths.PASSWORD_INPUT, signInData.password[0]);
        expect(await util.isComponentVisible(page, SignInXPaths.SIGN_IN_DISABLED_BUTTON)).toBeTruthy();
    });
});

describe('SignIn Flow --> Enter Incorrect Password', () => {
    it(`Enter incorrect password should show invalid credentials toast message %s`, async () => {
        await util.type(page, SignInXPaths.EMAIL_INPUT, signInData.emailAccount[0]);
        await util.type(page, SignInXPaths.PASSWORD_INPUT, signInData.password[1]);
        await util.clickOn(page, SignInXPaths.SIGN_IN_BUTTON);
        expect(await util.isComponentVisible(page, SignInXPaths.INVALID_CREDENTIALS_TOAST_MESSAGE)).toBeTruthy();
    });
});

describe('SignIn Flow --> Remove Password', () => {
    it(`No password should not enable the Sign In button %s`, async () => {
        await util.type(page, SignInXPaths.EMAIL_INPUT, signInData.emailAccount[0]);
        await util.type(page, SignInXPaths.PASSWORD_INPUT, signInData.password[2]);
        expect(await util.isComponentVisible(page, SignInXPaths.SIGN_IN_DISABLED_BUTTON)).toBeTruthy();
    });
});

describe('SignIn Flow --> Enter Correct Credentials', () => {
    it(`Enter Email and Password, and check Sign In button enabled and user logged In to portal %s`, async () => {
        await util.type(page, SignInXPaths.EMAIL_INPUT, signInData.emailAccount[0]);
        await util.type(page, SignInXPaths.PASSWORD_INPUT, signInData.password[0]);
        expect(await util.isComponentVisible(page, SignInXPaths.SIGN_IN_BUTTON)).toBeTruthy();
        await util.clickOn(page, SignInXPaths.SIGN_IN_BUTTON);
        expect(await util.isComponentVisible(page, ConsumerPortalXPaths.WELCOME_TEXT, 15000)).toBeTruthy();
        expect(await util.isComponentVisible(page, ConsumerPortalXPaths.ACTIVITY_BUTTON)).toBeTruthy();
        expect(await util.isComponentVisible(page, ConsumerPortalXPaths.NOTIFICATIONS_BUTTON)).toBeTruthy();
        expect(await util.isComponentVisible(page, ConsumerPortalXPaths.SETTINGS_BUTTON)).toBeTruthy();
        expect(await util.isComponentVisible(page, ConsumerPortalXPaths.LOGOUT_BUTTON)).toBeTruthy();
        await util.clickOn(page, ConsumerPortalXPaths.LOGOUT_BUTTON);
        await page.close();
    });
});
