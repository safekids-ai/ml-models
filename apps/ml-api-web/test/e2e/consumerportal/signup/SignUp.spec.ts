import { Page } from 'puppeteer';
import { Util } from '../../common/Util';
import { Urls } from '../../common/Urls';
import { SignUpData } from '../../data/SignUpData';
import { SignUpXPaths } from './SignUpXPaths';
import {SignInXPaths} from "../signin/SignInXPaths";
import { CommonXPaths } from '../../common/CommonXPaths';

let util = new Util();
let signUpData = new SignUpData();

let page: Page;
let counter: number = 0;

describe('Consumer Portal => Sign In Page', () => {
    beforeEach(async () => {
        page = await util.pageViewPort();
    });

    describe('SignUP Flow --> Check UI', () => {
        it(`Check Logo, Buttons, input fields, and text present %s`, async () => {
            await page.goto(Urls.signUpURL, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(2000);
            expect(await util.isComponentVisible(page, CommonXPaths.SAFEKIDS_LOGO)).toBeTruthy();
            expect(await util.isComponentVisible(page, CommonXPaths.SAFEKIDS_IMAGE)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignUpXPaths.CREATE_AN_ACCOUNT_TEXT)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignUpXPaths.ALREADY_HAVE_AN_ACCOUNT_TEXT)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignUpXPaths.SIGN_IN_BUTTON)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignUpXPaths.FIRST_NAME_INPUT)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignUpXPaths.LAST_NAME_INPUT)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignUpXPaths.EMAIL_INPUT)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignUpXPaths.PASSWORD_INPUT)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignUpXPaths.PASSWORD_EYE_ICON)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignUpXPaths.INFORMATION_ICON)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignUpXPaths.SIGNUP_BUTTON_DISABLED)).toBeTruthy();
            expect(await util.isComponentVisible(page, CommonXPaths.ALL_RIGHTS_RESERVED_TEXT)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignUpXPaths.BY_PROCEEDING_TEXT)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignUpXPaths.SERVICES_TERMS_LINK)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignUpXPaths.AND_CONFIRM_TEXT)).toBeTruthy();
            expect(await util.isComponentVisible(page, SignUpXPaths.PRIVACY_POLICY_LINK)).toBeTruthy();
            await util.type(page, SignUpXPaths.PASSWORD_INPUT, signUpData.password[2]);
            await util.clickOn(page, SignUpXPaths.PASSWORD_EYE_ICON);
            expect(await util.isComponentVisible(page, SignUpXPaths.UNHIDDEN_PASSWORD)).toBeTruthy();
            await util.clickOn(page, SignUpXPaths.PASSWORD_EYE_ICON);
            expect(await util.isComponentVisible(page, SignUpXPaths.PASSWORD_INPUT)).toBeTruthy();
            await util.type(page, SignUpXPaths.PASSWORD_INPUT, signUpData.password[3]);
        });
    });
});

describe('SignUP Flow --> Check Password Strength bar', () => {
    it(`Check password strength bar working fine %s`, async () => {
        expect(await util.getNumberOfElements(page, SignUpXPaths.PASSWORD_STRENGTH_BAR_WITHOUT_COLOR)).toEqual(8);
        await util.type(page, SignUpXPaths.PASSWORD_INPUT, signUpData.password[0]);
        expect(await util.isComponentVisible(page, SignUpXPaths.WRONG_FORMAT_PASSWORD_TOAST_MESSAGE)).toBeTruthy();
        expect(await util.isComponentVisible(page, SignUpXPaths.SPACES_ARE_NOT_ALLOWED_TEXT)).toBeTruthy();
        await page.waitForTimeout(1000);
        await util.type(page, SignUpXPaths.PASSWORD_INPUT, signUpData.password[1]);
        expect(await util.getNumberOfElements(page, SignUpXPaths.PASSWORD_STRENGTH_BAR_WITH_COLOR)).toEqual(2);
    });
});

describe('SignUp Flow --> Click "Sign Up"', () => {
    test.each(signUpData.firstNameWrongFormat)(`Check invalid first name should not enable signup %s`, async (term: string) => {
        if (counter === 0) {
            await util.type(page, SignUpXPaths.EMAIL_INPUT, signUpData.emailAccount[0]);
            await util.type(page, SignUpXPaths.PASSWORD_INPUT, signUpData.password[2]);
            await util.type(page, SignUpXPaths.FIRST_NAME_INPUT, term);
            await util.type(page, SignUpXPaths.LAST_NAME_INPUT, signUpData.lastName[0]);
            counter += 1;
        } else {
            await util.type(page, SignUpXPaths.FIRST_NAME_INPUT, term);
        }
        expect(await util.isComponentVisible(page, SignUpXPaths.SIGNUP_BUTTON_DISABLED)).toBeTruthy();
    });
    counter = 0;
});

describe('SignUp Flow --> Click "Sign Up"', () => {
    test.each(signUpData.lastNameWrongFormat)(`Check invalid last name should not enable signup %s`, async (term: string) => {
        counter = 0;
        await util.type(page, SignUpXPaths.FIRST_NAME_INPUT, signUpData.firstName[0]);
        await util.type(page, SignUpXPaths.LAST_NAME_INPUT, term);
        expect(await util.isComponentVisible(page, SignUpXPaths.SIGNUP_BUTTON_DISABLED)).toBeTruthy();
    });
});

describe('SignUP Flow --> Enter Invalid email', () => {
    it(`Invalid email should not enable SignUp button %s`, async () => {
        await util.type(page, SignUpXPaths.FIRST_NAME_INPUT, signUpData.firstName[0]);
        await util.type(page, SignUpXPaths.LAST_NAME_INPUT, signUpData.lastName[0]);
        await util.type(page, SignUpXPaths.EMAIL_INPUT, signUpData.emailAccount[2]);
        await util.type(page, SignUpXPaths.PASSWORD_INPUT, signUpData.password[2]);
        await page.waitForTimeout(1000);
        expect(await util.isComponentVisible(page, SignUpXPaths.SIGNUP_BUTTON_DISABLED)).toBeTruthy();
    });
});


describe('SignUP Flow --> Enter User details already signed up', () => {
    it(`Enter First Name, Last Name, Email, Password, and check toast message user with email already exists %s`, async () => {
        await util.clickOn(page,SignInXPaths.SIGN_UP_BUTTON);
        await util.type(page, SignUpXPaths.FIRST_NAME_INPUT, signUpData.firstName[0]);
        await util.type(page, SignUpXPaths.LAST_NAME_INPUT, signUpData.lastName[0]);
        await util.type(page, SignUpXPaths.EMAIL_INPUT, signUpData.emailAccount[0]);
        await util.type(page, SignUpXPaths.PASSWORD_INPUT, signUpData.password[2]);
        await page.waitForTimeout(1000);
        expect(await util.isComponentVisible(page, SignUpXPaths.SIGNUP_BUTTON)).toBeTruthy();
        await util.clickOn(page, SignUpXPaths.SIGNUP_BUTTON);
        expect(
            await util.isComponentVisible(
                page,
                SignUpXPaths.ALREADY_EXIST_TOAST_MESSAGE_PART1 + signUpData.emailAccount[0] + SignUpXPaths.ALREADY_EXIST_TOAST_MESSAGE_PART2,
            ),
        ).toBeTruthy();
        await page.close();
    });
});



