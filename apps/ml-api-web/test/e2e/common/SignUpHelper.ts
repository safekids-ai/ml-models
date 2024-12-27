import { Browser, Page, Target } from 'puppeteer';
import { Util } from './Util';
import { SignUpXPaths } from '../consumerportal/signup/SignUpXPaths';
import { CommonXPaths } from './CommonXPaths';
import { SignInXPaths } from '../consumerportal/signin/SignInXPaths';
import { SignUpData } from '../data/SignUpData';
import { SignInData } from '../data/SignInData';
import { Urls } from './Urls';
import { OnboardingXPaths } from '../consumerportal/onboarding/OnboardingXPaths';
import { OnboardingData } from '../data/OnboardingData';
import { AddKidsXPaths } from '../consumerportal/dashboard/settings/addkids/AddKidsXPaths';
import { ConsumerPortalXPaths } from '../consumerportal/ConsumerPortalXPaths';
import {string} from "yup";

export class SignUpHelper {
    public util: Util = new Util();
    public signUpData: SignUpData = new SignUpData();
    public signInData: SignInData = new SignInData();
    public onboardingData: OnboardingData = new OnboardingData();
    private page: Page | undefined;

    constructor(private browser: Browser) {}

    testSignUp = async (signUpUrl: string, signInUrl: string) => {
        this.page = await this.browser.newPage();
        if (!this.page) {
            throw new Error('Page is null');
        }
        console.log(`> test Sign UP user.`);
        await this.signUpUser(this.page, signUpUrl, signInUrl);
    };

    signUpUser = async (thisPage: Page, signUpURL: string, signInUrl: string) => {
        await thisPage.waitForTimeout(2000);
        await thisPage.bringToFront();

        console.log(`    >> test "SignUP" page`);
        await thisPage.goto(signUpURL, { waitUntil: 'domcontentloaded' });
        await this.util.type(thisPage, SignUpXPaths.FIRST_NAME_INPUT, this.signUpData.firstName[0]);
        await this.util.type(thisPage, SignUpXPaths.LAST_NAME_INPUT, this.signUpData.lastName[0]);
        await this.util.type(thisPage, SignUpXPaths.EMAIL_INPUT, this.signUpData.emailAccount[0]);
        await this.util.type(thisPage, SignUpXPaths.PASSWORD_INPUT, this.signUpData.password[2]);
        await thisPage.waitForTimeout(1000);
        await this.util.clickOn(thisPage, SignUpXPaths.SIGNUP_BUTTON);
        await thisPage.waitForTimeout(3000);
        await thisPage.waitForXPath(CommonXPaths.ALL_RIGHTS_RESERVED_TEXT);
        await thisPage.waitForXPath(SignUpXPaths.EMAIL_VERIFICATION_TEXT);
        await thisPage.waitForXPath(SignUpXPaths.TEXT_BELOW_EMAIL_VERIFICATION);
        await thisPage.waitForXPath(SignUpXPaths.INPUT_FIELD_EMAIL);
        await thisPage.waitForXPath(SignUpXPaths.TOAST_MESSAGE_PLEASE_ENTER_CODE);
        await thisPage.waitForXPath(SignUpXPaths.DISABLED_VERIFY);
        await thisPage.waitForXPath(SignUpXPaths.HAVENT_RECEIVED_CODE);
        await thisPage.waitForXPath(SignUpXPaths.RESEND_BUTTON);
        await thisPage.waitForXPath(CommonXPaths.ALL_RIGHTS_RESERVED_TEXT);
        const element = await thisPage.$x(SignUpXPaths.INPUT_FIELD_EMAIL);
        for (let i = 0; i < element.length; i++) {
            await element[i].type('1');
        }
        await thisPage.waitForXPath(SignInXPaths.DONT_HAVE_ACCOUNT_TEXT);
        await this.onboardingHelper(thisPage, signInUrl);
    };

    onboardingHelper = async (thisPage: Page, signInURL: string) => {
        console.log('    >> test Onboarding page');
        console.log('    >> Onboarding Flow --> Check COPPA Agreement UI');
        await thisPage.goto(signInURL, { waitUntil: 'domcontentloaded' });
        await thisPage.waitForTimeout(2000);
        await this.util.type(thisPage, SignInXPaths.EMAIL_INPUT, this.signInData.emailAccount[0]);
        await this.util.type(thisPage, SignInXPaths.PASSWORD_INPUT, this.signInData.password[0]);
        await this.util.clickOn(thisPage, SignInXPaths.SIGN_IN_BUTTON);
        await thisPage.waitForXPath(CommonXPaths.SAFEKIDS_LOGO);

        await thisPage.waitForXPath(OnboardingXPaths.COPPA_PARENTAL_CONSENT_HEADING);
        await thisPage.waitForXPath(OnboardingXPaths.PLEASE_REVIEW_TEXT);
        await thisPage.waitForXPath(OnboardingXPaths.RADIO_LEGAL_AUTHORITY + '[1]');
        await thisPage.waitForXPath(OnboardingXPaths.RADIO_LEGAL_AUTHORITY + '[2]');
        await thisPage.waitForXPath(OnboardingXPaths.YES_TEXT_LEGAL_AUTHORITY);
        await thisPage.waitForXPath(OnboardingXPaths.NO_TEXT_LEGAL_AUTHORITY);
        await thisPage.waitForXPath(OnboardingXPaths.CHECKBOX_I_AGREE);
        await thisPage.waitForXPath(OnboardingXPaths.I_AGREE_TEXT);
        await thisPage.waitForXPath(OnboardingXPaths.I_AGREE_PRIVACY_LINK);
        await thisPage.waitForXPath(OnboardingXPaths.I_AGREE_TERMS_LINK);
        await thisPage.waitForXPath(OnboardingXPaths.FOR_QUERY_CONTACT_TEXT);
        await thisPage.waitForXPath(OnboardingXPaths.NEXT_BUTTON_DISABLED_COPPA);
        await thisPage.waitForXPath(CommonXPaths.ALL_RIGHTS_RESERVED_TEXT_COPPA);

        console.log('    >> Onboarding Flow -> COPPA Screen -> Set legal authority to NO -> Click i agree');
        await this.util.clickOn(thisPage, OnboardingXPaths.RADIO_LEGAL_AUTHORITY + '[2]');
        await this.util.clickOn(thisPage, OnboardingXPaths.CHECKBOX_I_AGREE);
        await thisPage.waitForXPath(OnboardingXPaths.NEXT_BUTTON_DISABLED_COPPA);

        console.log('    >> Onboarding Flow --> COPPA Screen -> Set legal authority to YES -> Uncheck i agree');
        await this.util.clickOn(thisPage, OnboardingXPaths.RADIO_LEGAL_AUTHORITY + '[1]');
        await this.util.clickOn(thisPage, OnboardingXPaths.CHECKBOX_I_AGREE);
        await thisPage.waitForXPath(OnboardingXPaths.NEXT_BUTTON_DISABLED_COPPA);

        console.log('    >> Onboarding Flow --> COPPA Screen -> Set legal authority to YES -> Check i agree');
        await this.util.clickOn(thisPage, OnboardingXPaths.RADIO_LEGAL_AUTHORITY + '[1]');
        await this.util.clickOn(thisPage, OnboardingXPaths.CHECKBOX_I_AGREE);
        await thisPage.waitForXPath(OnboardingXPaths.NEXT_BUTTON_COPPA);
        await this.util.clickOn(thisPage, OnboardingXPaths.NEXT_BUTTON_COPPA);

        console.log('    >> Add Kids Flow --> Add Kid -> Check UI');

        await thisPage.waitForXPath(AddKidsXPaths.ADD_MORE_BUTTON);
        await thisPage.waitForXPath(OnboardingXPaths.NEXT_BUTTON_DISABLED_ADD_KID);

        console.log('    >> Add Kids Flow --> Add Kid -> Enter the Kids');
        await this.util.type(thisPage, AddKidsXPaths.FIRST_NAME_INPUT + '[1]', this.onboardingData.firstName[0]);
        await this.util.type(thisPage, AddKidsXPaths.LAST_NAME_INPUT + '[1]', this.onboardingData.lastName[0]);
        await this.util.clickOn(thisPage, AddKidsXPaths.YEAR_OF_BIRTH_DROPDOWN + '[1]');
        await thisPage.waitForTimeout(1000);
        await this.util.clickOn(thisPage, AddKidsXPaths.SELECT_YEAR_A + this.onboardingData.yearOfBirth[0] + AddKidsXPaths.SELECT_YEAR_B);
        await thisPage.waitForTimeout(1000);
        await this.util.clickOn(thisPage, AddKidsXPaths.ADD_MORE_BUTTON);
        await this.util.type(thisPage, AddKidsXPaths.FIRST_NAME_INPUT + '[2]', this.onboardingData.firstName[1]);
        await this.util.type(thisPage, AddKidsXPaths.LAST_NAME_INPUT + '[2]', this.onboardingData.lastName[1]);
        await this.util.clickOn(thisPage, AddKidsXPaths.YEAR_OF_BIRTH_DROPDOWN + '[2]');
        await thisPage.waitForTimeout(1000);
        await this.util.clickOn(thisPage, AddKidsXPaths.SELECT_YEAR_A + this.onboardingData.yearOfBirth[1] + AddKidsXPaths.SELECT_YEAR_B);
        await thisPage.waitForTimeout(1000);

        console.log('    >> Add Kids Flow --> Remove First Name');
        for (let i = 1; i < 3; i++) {
            await this.util.type(thisPage, AddKidsXPaths.FIRST_NAME_INPUT + '[' + i + ']', this.onboardingData.firstName[3]);
            await thisPage.waitForXPath(OnboardingXPaths.NEXT_BUTTON_DISABLED_ADD_KID);
            await thisPage.waitForTimeout(100);
            await this.util.type(thisPage, AddKidsXPaths.FIRST_NAME_INPUT + '[' + i + ']', this.onboardingData.firstName[i - 1]); //get back to default
            await thisPage.waitForXPath(OnboardingXPaths.NEXT_BUTTON_ADD_KID); //check save enabled when default
        }

        console.log('    >> Add Kids Flow --> Remove Last Name');
        for (let i = 1; i < 3; i++) {
            await this.util.type(thisPage, AddKidsXPaths.LAST_NAME_INPUT + '[' + i + ']', this.onboardingData.lastName[3]);
            await thisPage.waitForXPath(OnboardingXPaths.NEXT_BUTTON_DISABLED_ADD_KID);
            await thisPage.waitForTimeout(100);
            await this.util.type(thisPage, AddKidsXPaths.LAST_NAME_INPUT + '[' + i + ']', this.onboardingData.lastName[i - 1]); //get back to default
            await thisPage.waitForXPath(OnboardingXPaths.NEXT_BUTTON_ADD_KID); //check save enabled when default
        }

        console.log('    >> Add Kids Flow --> Click Next button');
        await this.util.clickOn(thisPage, OnboardingXPaths.NEXT_BUTTON_ADD_KID);
        await thisPage.waitForTimeout(2000);
        // await thisPage.waitForXPath(OnboardingXPaths.DOWNLOAD_EXTENSION_TEXT);

        console.log('    >> Plan Screen --> Check UI');
        await thisPage.waitForXPath(OnboardingXPaths.PLAN_HEADING);
        await thisPage.waitForXPath(OnboardingXPaths.PLAN_TEXT);
        await thisPage.waitForXPath(OnboardingXPaths.PROMOTIONAL_CODE_HEADING);
        await thisPage.waitForXPath(OnboardingXPaths.PROMOTIONAL_CODE_TEXT);
        await thisPage.waitForXPath(OnboardingXPaths.CODE_INPUT);
        await thisPage.waitForXPath(OnboardingXPaths.APPLY_BUTTON);
        await this.util.type(thisPage, OnboardingXPaths.CODE_INPUT, '123');
        await thisPage.waitForXPath(OnboardingXPaths.INPUT_CROSS_BUTTON);
        await this.util.clickOn(thisPage, OnboardingXPaths.APPLY_BUTTON);
        await thisPage.waitForXPath(OnboardingXPaths.TOAST_INVALID_CODE);
        await this.util.clickOn(thisPage, OnboardingXPaths.INPUT_CROSS_BUTTON);
        await thisPage.waitForXPath(OnboardingXPaths.TOAST_FIELD_IS_REQUIRED);
        await this.util.type(thisPage, OnboardingXPaths.CODE_INPUT, 'usman2022');
        await this.util.clickOn(thisPage, OnboardingXPaths.APPLY_BUTTON);
        await thisPage.waitForTimeout(2000);
        await thisPage.waitForXPath(OnboardingXPaths.DISCOUNT_TEXT);
        const discountedText: string = await this.util.getTextValue(thisPage,OnboardingXPaths.DISCOUNT_TEXT);
        const discountedValue = discountedText.split(' ').filter(text=>{return text.includes('%')});
        await thisPage.waitForXPath(OnboardingXPaths.PROMOTIONAL_CODE_THANKS);

        await thisPage.waitForXPath(OnboardingXPaths.MONTHLY_PRICE_TEXT(discountedValue[0]));
        await thisPage.waitForXPath(OnboardingXPaths.MONTHLY_DISCOUNTED_PRICE(discountedValue[0]));
        await thisPage.waitForXPath(OnboardingXPaths.CARD_ONE_PER_MONTH_TEXT(discountedValue[0]));
        await thisPage.waitForXPath(OnboardingXPaths.CARD_ONE_PLAN_CONTENT(discountedValue[0]));
        await thisPage.waitForXPath(OnboardingXPaths.CARD_ONE_CHOOSE_BUTTON(discountedValue[0]));
        await thisPage.waitForXPath(OnboardingXPaths.YEARLY_PRICE_TEXT(discountedValue[0]));
        await thisPage.waitForXPath(OnboardingXPaths.YEARLY_DISCOUNTED_PRICE(discountedValue[0]));
        await thisPage.waitForXPath(OnboardingXPaths.CARD_TWO_PER_MONTH_TEXT(discountedValue[0]));
        await thisPage.waitForXPath(OnboardingXPaths.CARD_TWO_PLAN_CONTENT(discountedValue[0]));
        await thisPage.waitForXPath(OnboardingXPaths.CARD_TWO_CHOOSE_BUTTON(discountedValue[0]));
        await thisPage.waitForXPath(OnboardingXPaths.NEXT_DISABLED_BUTTON_PLAN);
        await this.util.clickOn(thisPage, OnboardingXPaths.CARD_ONE_CHOOSE_BUTTON(discountedValue[0]));
        await thisPage.waitForXPath(OnboardingXPaths.NAME_ON_CARD_INPUT);
        await this.util.type(thisPage, OnboardingXPaths.NAME_ON_CARD_INPUT, 'Uzair');
        await thisPage.waitForXPath(OnboardingXPaths.CARD_NUMBER_INPUT);
        await thisPage.waitForTimeout(1000);
        await this.util.clickOn(thisPage, OnboardingXPaths.CARD_NUMBER_INPUT);
        await thisPage.waitForTimeout(1000);
        await this.util.typeF(thisPage, OnboardingXPaths.CARD_NUMBER_INPUT, '4242424242424242');
        await this.util.type(thisPage, OnboardingXPaths.CVC_INPUT, '123');
        await this.util.type(thisPage, OnboardingXPaths.EXP_DATE_INPUT, '1024');
        await this.util.type(thisPage, OnboardingXPaths.POSTAL_CODE_INPUT, '46000');
        await this.util.clickOn(thisPage, OnboardingXPaths.ENTER_BUTTON);
        await thisPage.waitForXPath(OnboardingXPaths.CARD_ONE_THANK_YOU(discountedValue[0]));
        await thisPage.waitForXPath(OnboardingXPaths.PAYMENT_HEADING);
        await thisPage.waitForXPath(OnboardingXPaths.PAYMENT_TEXT);
        let details: string = '**** **** **** 4242 - Ex Date 10/2024';
        await thisPage.waitForXPath(OnboardingXPaths.CARD_DETAILS(details));
        await thisPage.waitForXPath(OnboardingXPaths.PAYMENT_CHANGE_BUTTON);

        await this.util.clickOn(thisPage, OnboardingXPaths.PAYMENT_CHANGE_BUTTON);
        await thisPage.waitForXPath(OnboardingXPaths.NAME_ON_CARD_INPUT);
        await this.util.type(thisPage, OnboardingXPaths.NAME_ON_CARD_INPUT, 'Uzair M');
        await thisPage.waitForXPath(OnboardingXPaths.CARD_NUMBER_INPUT);
        await thisPage.waitForTimeout(1000);
        await this.util.clickOn(thisPage, OnboardingXPaths.CARD_NUMBER_INPUT);
        await thisPage.waitForTimeout(1000);
        await this.util.typeF(thisPage, OnboardingXPaths.CARD_NUMBER_INPUT, '4242424242424242');
        await this.util.type(thisPage, OnboardingXPaths.CVC_INPUT, '123');
        await this.util.type(thisPage, OnboardingXPaths.EXP_DATE_INPUT, '1025');
        await this.util.type(thisPage, OnboardingXPaths.POSTAL_CODE_INPUT, '46000');
        await this.util.clickOn(thisPage, OnboardingXPaths.ENTER_BUTTON);
        await thisPage.waitForTimeout(10000);
        await thisPage.waitForXPath(OnboardingXPaths.NEXT_BUTTON_PLAN);
        await this.util.clickOn(thisPage, OnboardingXPaths.NEXT_BUTTON_PLAN);

        console.log('    >> Final Screen --> Next Steps -> Check UI');
        await thisPage.waitForXPath(CommonXPaths.SAFEKIDS_LOGO);
        await thisPage.waitForXPath(OnboardingXPaths.COPPA_NEXT_TEXT_ON_LEFT_SIDE);
        await thisPage.waitForXPath(OnboardingXPaths.ADD_KID_NEXT_TEXT_ON_LEFT_SIDE);
        await thisPage.waitForXPath(OnboardingXPaths.NEXT_STEPS_HEADING);
        // await thisPage.waitForXPath(OnboardingXPaths.CHOOSE_WHOLE_FAMILY_TEXT);
        await thisPage.waitForXPath(OnboardingXPaths.NEXT_STEP_FIRST_LIST_ITEM);
        await thisPage.waitForXPath(OnboardingXPaths.NEXT_STEP_SECOND_LIST_ITEM);
        await thisPage.waitForXPath(OnboardingXPaths.NEXT_STEP_THIRD_LIST_ITEM);
        await thisPage.waitForXPath(OnboardingXPaths.SHORT_CHILD_NAME_A + this.onboardingData.childShortName[0] + OnboardingXPaths.SHORT_CHILD_NAME_B);
        await thisPage.waitForXPath(OnboardingXPaths.CHILD_NAME_A + this.onboardingData.childName[0] + OnboardingXPaths.CHILD_NAME_B);
        await thisPage.waitForXPath(OnboardingXPaths.SHORT_CHILD_NAME_A + this.onboardingData.childShortName[1] + OnboardingXPaths.SHORT_CHILD_NAME_B);
        await thisPage.waitForXPath(OnboardingXPaths.CHILD_NAME_A + this.onboardingData.childName[1] + OnboardingXPaths.CHILD_NAME_B);
        await thisPage.waitForXPath(OnboardingXPaths.ACCESS_CODE_HEADING);
        await thisPage.waitForXPath(OnboardingXPaths.FINISH_BUTTON);
        await this.util.clickOn(thisPage, OnboardingXPaths.FINISH_BUTTON);
        await thisPage.waitForXPath(ConsumerPortalXPaths.LOGOUT_BUTTON);
        await this.util.clickOn(thisPage, ConsumerPortalXPaths.LOGOUT_BUTTON);
        await thisPage.close();
    };
}
