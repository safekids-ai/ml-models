import { Page } from 'puppeteer';
import { Util } from '../../../../common/Util';
import { Urls } from '../../../../common/Urls';
import { SignInData } from '../../../../data/SignInData';
import { SignInXPaths } from '../../../signin/SignInXPaths';
import { ConsumerPortalXPaths } from '../../../ConsumerPortalXPaths';
import { PaymentXPaths } from './PaymentXPaths';
import { OnboardingXPaths } from '../../../onboarding/OnboardingXPaths';

let util = new Util();
let signInData = new SignInData();
let page: Page;

describe('Consumer Portal => Sign In Page', () => {
    beforeEach(async () => {
        page = await util.pageViewPort();
    });

    describe('Payment Flow --> Check UI', () => {
        it(`Check the payment fields, payment texts, and buttons present`, async () => {
            await page.goto(Urls.signInURL, { waitUntil: 'domcontentloaded' });
            const regx = /You are currently in a free trial, which will end in \d days \(\w{3,9} \d{1,2}, \d{4}\). After the free trial, you will be charged \$\w{1,4}.\w{1,3} monthly. View Plan/

            await page.waitForTimeout(2000);
            await util.type(page, SignInXPaths.EMAIL_INPUT, signInData.emailAccount[0]);
            await util.type(page, SignInXPaths.PASSWORD_INPUT, signInData.password[0]);
            await util.clickOn(page, SignInXPaths.SIGN_IN_BUTTON);
            expect(await util.isComponentVisible(page, ConsumerPortalXPaths.SETTINGS_BUTTON)).toBeTruthy();
            await util.clickOn(page, ConsumerPortalXPaths.SETTINGS_BUTTON);
            expect(await util.isComponentVisible(page, PaymentXPaths.PAYMENT_HEADING)).toBeTruthy();
            await page.waitForTimeout(2000);
            expect(regx.test(await util.getTextValue(page,PaymentXPaths.PAYMENT_TEXT))).toBeTruthy();
            expect(await util.isComponentVisible(page, PaymentXPaths.VIEW_PLAN_BUTTON)).toBeTruthy();
            expect(await util.isComponentVisible(page, PaymentXPaths.CHANGE_BUTTON)).toBeTruthy();
            expect(await util.isComponentVisible(page, PaymentXPaths.PAYMENT_TEXT_2a)).toBeTruthy();
            let details: string = '**** **** **** 4242 - Ex Date 10/2025';
            expect(await util.isComponentVisible(page, PaymentXPaths.PAYMENT_TEXT_2b(details))).toBeTruthy();
            expect(await util.isComponentVisible(page, PaymentXPaths.PAYMENT_ENDING_TEXT)).toBeTruthy();
        });
    });
});

describe.skip('Payment Flow --> Click View Plan ', () => {
    it(`Check the two cards, their text, and buttons, and change the payment plan `, async () => {

        const regxOne = /\$\d{1,4}.\d{1,3}/;
        const regxTwo = /Your first \d days are free, but in order to continue, you must choose a plan and provide your credit card number./;
        const regxCardOneText = /This plan asks for a monthly payment. Each month we’ll notify you of your monthly payment for a total of \$\d{1,4}.\d{1,3}./;
        const regxCardTwoText = /This plan asks for a single payment for the year and provides a ~\w{1,3}% discount.Your total is \$\d{1,4}.\d{1,3} for the year./;

        await util.clickOn(page, PaymentXPaths.VIEW_PLAN_BUTTON);
        expect(await util.isComponentVisible(page, PaymentXPaths.CLOSE_PLAN_BUTTON)).toBeTruthy();
        await page.waitForTimeout(4000);
        expect(await util.isComponentVisible(page, OnboardingXPaths.PLAN_HEADING)).toBeTruthy();
        expect(await util.isComponentVisible(page, OnboardingXPaths.PLAN_TEXT)).toBeTruthy();
        expect(regxTwo.test(await util.getTextValue(page, OnboardingXPaths.PLAN_TEXT))).toBeTruthy();
        const planNameHeading: string = await util.getTextValue(page,PaymentXPaths.PLAN_NAME_HEADING);
        const discountedValue = planNameHeading.replace('(',' ').split(' ').filter(text=>{return text.includes('%')});
        console.log(discountedValue)
        expect(regxOne.test(await util.getTextValue(page, OnboardingXPaths.MONTHLY_PRICE_TEXT(discountedValue[0])))).toBeTruthy();
        expect(regxOne.test(await util.getTextValue(page, OnboardingXPaths.MONTHLY_DISCOUNTED_PRICE(discountedValue[0])))).toBeTruthy();
        expect(await util.isComponentVisible(page, OnboardingXPaths.CARD_ONE_PER_MONTH_TEXT(discountedValue[0]))).toBeTruthy();
        expect(await util.isComponentVisible(page, OnboardingXPaths.CARD_ONE_PLAN_CONTENT(discountedValue[0]))).toBeTruthy();
        console.log(regxCardOneText.test(await util.getTextValue(page, OnboardingXPaths.CARD_ONE_PLAN_CONTENT(discountedValue[0]))));
        expect(regxCardOneText.test(await util.getTextValue(page, OnboardingXPaths.CARD_ONE_PLAN_CONTENT(discountedValue[0])))).toBeTruthy();
        expect(await util.isComponentVisible(page, OnboardingXPaths.CARD_ONE_THANK_YOU(discountedValue[0]))).toBeTruthy();

        expect(regxOne.test(await util.getTextValue(page, OnboardingXPaths.YEARLY_PRICE_TEXT(discountedValue[0])))).toBeTruthy();
        expect(regxOne.test(await util.getTextValue(page, OnboardingXPaths.YEARLY_DISCOUNTED_PRICE(discountedValue[0])))).toBeTruthy();
        expect(await util.isComponentVisible(page, OnboardingXPaths.CARD_TWO_PER_MONTH_TEXT(discountedValue[0]))).toBeTruthy();
        expect(await util.isComponentVisible(page, OnboardingXPaths.CARD_TWO_PLAN_CONTENT(discountedValue[0]))).toBeTruthy();
        expect(regxCardTwoText.test(await util.getTextValue(page, OnboardingXPaths.CARD_TWO_PLAN_CONTENT(discountedValue[0])))).toBeTruthy();
        expect(await util.isComponentVisible(page, OnboardingXPaths.CARD_TWO_CHOOSE_BUTTON(discountedValue[0]))).toBeTruthy();

        await util.clickOn(page, OnboardingXPaths.CARD_TWO_CHOOSE_BUTTON(discountedValue[0]));
        await page.waitForSelector(OnboardingXPaths.CARD_TWO_THANK_YOU(discountedValue[0]));
        expect(await util.isComponentVisible(page, OnboardingXPaths.CARD_ONE_CHOOSE_BUTTON(discountedValue[0]))).toBeTruthy();
        await util.clickOn(page, PaymentXPaths.CLOSE_PLAN_BUTTON);
        await page.waitForTimeout(1000);
    });
});

describe('Payment Flow --> Click CHANGE button ', () => {
    it(`Change the plan from CHANGE button `, async () => {
        await util.clickOn(page, PaymentXPaths.CHANGE_BUTTON);
        expect(await util.isComponentVisible(page, OnboardingXPaths.NAME_ON_CARD_INPUT)).toBeTruthy();
        await util.type(page, OnboardingXPaths.NAME_ON_CARD_INPUT, 'Muhammad Uzair');
        expect(await util.isComponentVisible(page, OnboardingXPaths.CARD_NUMBER_INPUT)).toBeTruthy();
        await page.waitForTimeout(1000);
        await util.clickOn(page, OnboardingXPaths.CARD_NUMBER_INPUT);
        await page.waitForTimeout(1000);
        await util.typeF(page, OnboardingXPaths.CARD_NUMBER_INPUT, '4242424242424242');
        await util.type(page, OnboardingXPaths.CVC_INPUT, '125');
        await util.type(page, OnboardingXPaths.EXP_DATE_INPUT, '1026');
        await util.type(page, OnboardingXPaths.POSTAL_CODE_INPUT, '49000');
        await util.clickOn(page, OnboardingXPaths.ENTER_BUTTON);
        expect(await util.isComponentVisible(page, OnboardingXPaths.ENTER_BUTTON, 10000)).toBeFalsy();
        let details: string = '**** **** **** 4242 - Ex Date 10/2026';
        expect(await util.isComponentVisible(page, PaymentXPaths.PAYMENT_TEXT_2b(details))).toBeTruthy();
    });
});

describe('Payment Flow --> Logout from account', () => {
    it(`Logout from dashboard %s`, async () => {
        await util.clickOn(page, ConsumerPortalXPaths.LOGOUT_BUTTON);
        await page.close();
    });
});
