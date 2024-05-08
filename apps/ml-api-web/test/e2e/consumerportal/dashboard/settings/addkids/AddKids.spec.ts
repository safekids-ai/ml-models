import { Page } from 'puppeteer';
import { Util } from '../../../../common/Util';
import { Urls } from '../../../../common/Urls';
import { SignInData } from '../../../../data/SignInData';
import { AddKidData } from '../../../../data/AddKidData';
import { SignInXPaths } from '../../../signin/SignInXPaths';
import { ConsumerPortalXPaths } from '../../../ConsumerPortalXPaths';
import { AddKidsXPaths } from './AddKidsXPaths';

let util = new Util();
let signInData = new SignInData();
let addKidData = new AddKidData();
let page: Page;

describe('Consumer Portal => Sign In Page', () => {
    beforeEach(async () => {
        page = await util.pageViewPort();
    });

    describe('Add Kids Flow --> Check UI', () => {
        it(`Check the Kids, input fields, buttons etc are present %s`, async () => {
            await page.goto(Urls.signInURL, { waitUntil: 'domcontentloaded' });
            await page.waitForTimeout(2000);
            await util.type(page, SignInXPaths.EMAIL_INPUT, signInData.emailAccount[0]);
            await util.type(page, SignInXPaths.PASSWORD_INPUT, signInData.password[0]);
            await util.clickOn(page, SignInXPaths.SIGN_IN_BUTTON);
            expect(await util.isComponentVisible(page, ConsumerPortalXPaths.SETTINGS_BUTTON)).toBeTruthy();
            await util.clickOn(page, ConsumerPortalXPaths.SETTINGS_BUTTON);
            expect(await util.isComponentVisible(page, AddKidsXPaths.ADD_KID_HEADING)).toBeTruthy();
            expect(await util.getNumberOfElements(page, AddKidsXPaths.FIRST_NAME_INPUT)).toEqual(2);
            expect(await util.getNumberOfElements(page, AddKidsXPaths.LAST_NAME_INPUT)).toEqual(2);
            expect(await util.getNumberOfElements(page, AddKidsXPaths.YEAR_OF_BIRTH_DROPDOWN)).toEqual(2);
            expect(await util.getNumberOfElements(page, AddKidsXPaths.GENERAL_REMOVE_BUTTON)).toEqual(2);
            expect(await util.isComponentVisible(page, AddKidsXPaths.ADD_MORE_BUTTON)).toBeTruthy();
            expect(await util.isComponentVisible(page, AddKidsXPaths.WANT_TO_ADD_ADDITIONAL_MEMBERS_TEXT)).toBeTruthy();
            expect(await util.isComponentVisible(page, AddKidsXPaths.SAVE_BUTTON)).toBeTruthy();
        });
    });
});

describe('Add Kids Flow --> Check Kids Information-', () => {
    it(`Check the Names, Date of Birth present %s`, async () => {
        expect(await util.getTextValueInputField(page, AddKidsXPaths.Kid_PRESENT('Muhammad', 'Muaz', '2005'))).toBeTruthy();
        expect(await util.getTextValueInputField(page, AddKidsXPaths.Kid_PRESENT('Ahmad', 'Khan', '2004'))).toBeTruthy();
    });
});

describe('Add Kids Flow --> Remove First Name', () => {
    it(`Check the SAVE button gets enabled %s`, async () => {
        for (let i = 0; i < addKidData.firstName.length - 2; i++) {
            await util.type(page, AddKidsXPaths.FIRST_NAME_WITH_VALUE(addKidData.firstName[i]), addKidData.firstName[3]);
            expect(await util.isComponentVisible(page, AddKidsXPaths.SAVE_BUTTON_DISABLED)).toBeTruthy();
            await util.type(page, AddKidsXPaths.FIRST_NAME_WITH_VALUE(addKidData.firstName[3]), addKidData.firstName[i]); //get back to default
            expect(await util.isComponentVisible(page, AddKidsXPaths.SAVE_BUTTON_DISABLED)).toBeFalsy(); //check save enabled when default
        }
    });
});

describe('Add Kids Flow --> Remove Last Name', () => {
    it(`Check the SAVE button gets enabled %s`, async () => {
        for (let i = 0; i < addKidData.lastName.length - 2; i++) {
            await util.type(page, AddKidsXPaths.LAST_NAME_WITH_VALUE(addKidData.lastName[i]), addKidData.lastName[3]);
            expect(await util.isComponentVisible(page, AddKidsXPaths.SAVE_BUTTON_DISABLED)).toBeTruthy();
            await util.type(page, AddKidsXPaths.LAST_NAME_WITH_VALUE(addKidData.lastName[3]), addKidData.lastName[i]); //get back to default
            expect(await util.isComponentVisible(page, AddKidsXPaths.SAVE_BUTTON_DISABLED)).toBeFalsy(); //check save enabled when default
        }
    });
});

describe('Add Kids Flow --> Click ADD MORE', () => {
    it(`Check the new First Name, Last Name and Year of Birth Field present and SAVE button disabled %s`, async () => {
        await util.clickOn(page, AddKidsXPaths.ADD_MORE_BUTTON);
        expect(await util.isComponentVisible(page, AddKidsXPaths.FIRST_NAME_INPUT + '[3]')).toBeTruthy();
        expect(await util.isComponentVisible(page, AddKidsXPaths.LAST_NAME_INPUT + '[3]')).toBeTruthy();
        expect(await util.isComponentVisible(page, AddKidsXPaths.YEAR_OF_BIRTH_DROPDOWN + '[3]')).toBeTruthy();
        expect(await util.isComponentVisible(page, AddKidsXPaths.GENERAL_REMOVE_BUTTON + '[3]')).toBeTruthy();
        expect(await util.isComponentVisible(page, AddKidsXPaths.SAVE_BUTTON_DISABLED)).toBeTruthy();
    });
});

describe('Add Kids Flow --> Click on Last Remove button', () => {
    it(`Check the SAVE button gets enabled %s`, async () => {
        await util.clickOn(page, AddKidsXPaths.GENERAL_REMOVE_BUTTON + '[3]');
        expect(await util.isComponentVisible(page, AddKidsXPaths.SAVE_BUTTON)).toBeTruthy();
    });
});

describe('Add Kids Flow --> Add New Kid', () => {
    it(`After Adding Check SAVE button enabled and kid added successfully %s`, async () => {
        await util.clickOn(page, AddKidsXPaths.ADD_MORE_BUTTON);
        await util.type(page, AddKidsXPaths.FIRST_NAME_INPUT + '[3]', addKidData.firstName[2]);
        expect(await util.isComponentVisible(page, AddKidsXPaths.SAVE_BUTTON_DISABLED)).toBeTruthy();
        await util.type(page, AddKidsXPaths.LAST_NAME_INPUT + '[3]', addKidData.lastName[2]);
        expect(await util.isComponentVisible(page, AddKidsXPaths.SAVE_BUTTON_DISABLED)).toBeTruthy();
        await util.clickOn(page, AddKidsXPaths.YEAR_OF_BIRTH_DROPDOWN + '[3]');
        await page.waitForTimeout(1000);
        await util.clickOn(page, AddKidsXPaths.SELECT_YEAR_A + addKidData.yearOfBirth[2] + AddKidsXPaths.SELECT_YEAR_B);
        await page.waitForTimeout(1000);
        expect(await util.isComponentVisible(page, AddKidsXPaths.FIRST_NAME_WITH_VALUE(addKidData.firstName[2]))).toBeTruthy();
        expect(await util.isComponentVisible(page, AddKidsXPaths.LAST_NAME_WITH_VALUE(addKidData.lastName[2]))).toBeTruthy();
        expect(await util.isComponentVisible(page, AddKidsXPaths.YEAR_OF_BIRTH_DROPDOWN_WITH_VALUE(addKidData.yearOfBirth[2]))).toBeTruthy();
        expect(await util.isComponentVisible(page, AddKidsXPaths.SAVE_BUTTON)).toBeTruthy();
        await util.clickOn(page, AddKidsXPaths.SAVE_BUTTON);
        expect(await util.isComponentVisible(page, AddKidsXPaths.KID_ADDED_SUCCESSFULLY_TEXT, 10000)).toBeTruthy();
    });
});

describe('Add Kids Flow --> Remove Last Kid', () => {
    it(`After Removing Check SAVE button enabled and kid added successfully %s`, async () => {
        await util.clickOn(page, AddKidsXPaths.REMOVE_BUTTON(addKidData.firstName[2]));
        await util.clickOn(page, AddKidsXPaths.SAVE_BUTTON);
        expect(await util.isComponentVisible(page, AddKidsXPaths.KID_ADDED_SUCCESSFULLY_TEXT, 10000)).toBeTruthy();
    });
});

describe('Add Kids Flow --> Logout from account', () => {
    it(`Logout from dashboard %s`, async () => {
        await util.clickOn(page, ConsumerPortalXPaths.LOGOUT_BUTTON);
        await page.close();
    });
});
