export class OnboardingXPaths {
    static COPPA_PARENTAL_CONSENT_HEADING: string = "//span[text()='COPPA Parental Consent']";
    static PLEASE_REVIEW_TEXT: string = "//span[text()='COPPA Parental Consent']/following-sibling::span[text()='Please review the Safe Kids']";
    static RADIO_LEGAL_AUTHORITY: string = "(//input[@name='hasLegalAuthorityToInstall'])";
    static YES_TEXT_LEGAL_AUTHORITY: string = "//input[@name='hasLegalAuthorityToInstall']/parent::span/parent::span/following-sibling::span[text()='Yes']";
    static NO_TEXT_LEGAL_AUTHORITY: string = "//input[@name='hasLegalAuthorityToInstall']/parent::span/parent::span/following-sibling::span[text()='No']";
    static CHECKBOX_I_AGREE: string = "//input[@name='boundByPrivacyPolicy' and @type='checkbox']";
    static I_AGREE_TEXT: string =
        "//input[@name='boundByPrivacyPolicy' and @type='checkbox']/parent::span/parent::span/following-sibling::span//span[text()='I agree, on behalf of myself and my child, to be bound by the']";
    static I_AGREE_PRIVACY_LINK: string =
        "//input[@name='boundByPrivacyPolicy' and @type='checkbox']/parent::span/parent::span/following-sibling::span//span[text()='I agree, on behalf of myself and my child, to be bound by the']//a[@href=\"https://www.safekids.ai/privacy_policy/\"]";
    static I_AGREE_TERMS_LINK: string =
        "//input[@name='boundByPrivacyPolicy' and @type='checkbox']/parent::span/parent::span/following-sibling::span//span[text()='I agree, on behalf of myself and my child, to be bound by the']//a[@href=\"https://www.safekids.ai/termsandconditions/\"]";
    static FOR_QUERY_CONTACT_TEXT: string = "//span[text()=' For any questions, please contact ']//a[text()='coppa@safekids.ai']";
    static NEXT_BUTTON_COPPA: string = "//button[./span[text()='Next']]";
    static NEXT_BUTTON_DISABLED_COPPA: string = "//button[@disabled][./span[text()='Next']]";
    static NEXT_BUTTON_ADD_KID: string = "//div[./span[text()='Add Kid']]//button[./span[text()='Next']]";
    static NEXT_BUTTON_DISABLED_ADD_KID: string = "//div[./span[text()='Add Kid']]//button[@disabled][./span[text()='Next']]";
    static NEXT_STEPS_HEADING: string = "//span[text()='Next Steps']";
    static NEXT_STEP_FIRST_LIST_ITEM = `//ul//li//span[text()="Keep this page open and go to your kids device"]`;
    static NEXT_STEP_SECOND_LIST_ITEM = `//ul//li//span[text()="Navigate to"]`;
    static NEXT_STEP_THIRD_LIST_ITEM = `//ul//li//span[text()="Download the extension"]`;
    static SHORT_CHILD_NAME_A: string = "//div[text()='";
    static SHORT_CHILD_NAME_B: string = "']";
    static CHILD_NAME_A: string = "//div[./span[text()='Next Steps']]//span[@class='kid-name' and text()='";
    static CHILD_NAME_B: string = "']";
    static ACCESS_CODE_HEADING: string = "//div[./span[text()='Next Steps']]//span[text()='Access Code']";
    static FINISH_BUTTON: string = "//div[./span[text()='Next Steps']]//button[./span[text()='Finish']]";
    static ADD_KID_NEXT_TEXT_ON_LEFT_SIDE: string = "//div[./span[text()='Add Kid']]//span[text()='NEXT']";
    static COPPA_NEXT_TEXT_ON_LEFT_SIDE: string = "//div[./span[text()='COPPA']]//span[text()='NEXT']";

    static PLAN_HEADING: string = "//span[text()='Plan']";
    static PROMOTIONAL_CODE_HEADING: string = "//div[./span[text()='Plan']]//div[@class='card-container']//span[text()='PROMOTIONAL CODE']";
    static PROMOTIONAL_CODE_TEXT: string =
        "//div[./span[text()='Plan']]//div[@class='card-container']//span[text()='PROMOTIONAL CODE']/following-sibling::span[text()='If you have a promotional code, enter it here:']";
    static CODE_INPUT: string = "//div[./span[text()='Plan']]//div[@class='card-container']//input[@name='CODE']";
    static INPUT_CROSS_BUTTON: string = "//div[./span[text()='Plan']]//div[@class='card-container']//div[./input[@name='CODE']]//*[name()='svg']";
    static APPLY_BUTTON: string = "//div[./span[text()='Plan']]//div[@class='card-container']//button//span[text()='APPLY']";
    static DISABLED_APPLY_BUTTON: string = "//div[./span[text()='Plan']]//div[@class='card-container']//button[@disabled]//span[text()='APPLY']";
    static DISCOUNT_TEXT: string = "//div[./span[text()='Plan']]//div[@class='card-container']//span[@class='text-code']";
    static PROMOTIONAL_CODE_THANKS: string = "//div[./span[text()='Plan']]//div[@class='card-container']//span[text()='Thanks']";

    static TOAST_FIELD_IS_REQUIRED: string = "//p[text()='Code is a required field.']";
    static TOAST_INVALID_CODE: string = "//p[text()='The code is invalid.']";

    static PLAN_TEXT: string =
        "//div[./span[text()='Plan']]//p";
    static CARD_ONE_CHOOSE_BUTTON= (percentOff: string) => `//div[./span[text()='Plan']]//span[text()='MONTHLY PAYMENT (${percentOff} off)']/following-sibling::button//span[text()='CHOOSE']`;

    static CARD_TWO_CHOOSE_BUTTON= (percentOff: string) => `//div[./span[text()='Plan']]//span[text()='YEARLY PAYMENT (${percentOff} off)']/following-sibling::button//span[text()='CHOOSE']`;

    static CARD_ONE_THANK_YOU= (percentOff: string) => `//div[./span[text()='Plan']]//span[text()='MONTHLY PAYMENT (${percentOff} off)']/following-sibling::span[text()='Thank you']`;
    static CARD_TWO_THANK_YOU= (percentOff: string) => `//div[./span[text()='Plan']]//span[text()='YEARLY PAYMENT (${percentOff} off)']/following-sibling::span[text()='Thank you']`;

    static PAYMENT_HEADING: string = "//span[text()='PAYMENT']";
    static PAYMENT_TEXT: string = "//span[text()='PAYMENT']/following-sibling::span[text()='The card you provided is currently being charged.']";
    static CARD_DETAILS = (details: string) => `//span[text()='PAYMENT']/following-sibling::span[text()='${details}']`;
    static PAYMENT_CHANGE_BUTTON: string = "//div[./div[./span[text()='PAYMENT']]]//button//span[text()='CHANGE']";
    static NEXT_DISABLED_BUTTON_PLAN: string = "//button[@disabled]//span[text()='Next']";
    static NEXT_BUTTON_PLAN: string = "//button//span[text()='Next']";

    static NAME_ON_CARD_INPUT: string = "//input[@name='name']";
    static CARD_NUMBER_INPUT: string = "//div[./label[text()='Card Number']]";
    static CVC_INPUT: string = "//label[text()='CVC']";
    static EXP_DATE_INPUT: string = "//label[text()='Expiry Date']";
    static POSTAL_CODE_INPUT: string = "//input[@name='postal_code' and @type='text']";
    static ENTER_BUTTON: string = "//div[./button//span[text()='CANCEL']]//button[@type='submit']//span[text()='ENTER']";

    static YEARLY_PRICE_TEXT= (percentOff: string) => `//div[./span[text()='Plan']]//div[./span[text()='YEARLY PAYMENT (${percentOff} off)']]//span[@class='price-text']`;
    static YEARLY_DISCOUNTED_PRICE= (percentOff: string) => `//div[./span[text()='Plan']]//div[./span[text()='YEARLY PAYMENT (${percentOff} off)']]//span[@class='discounted-price-text']`;
    static CARD_TWO_PER_MONTH_TEXT= (percentOff: string) => `//div[./span[text()='Plan']]//div[./span[text()='YEARLY PAYMENT (${percentOff} off)']]//span[text()='per month']`;
    static CARD_TWO_PLAN_CONTENT= (percentOff: string) => `//div[./span[text()='Plan']]//div[./span[text()='YEARLY PAYMENT (${percentOff} off)']]//div[@class='plan-content']`;


    static MONTHLY_PRICE_TEXT= (percentOff: string) => `//div[./span[text()='Plan']]//div[./span[text()='MONTHLY PAYMENT (${percentOff} off)']]//span[@class='price-text']`;
    static MONTHLY_DISCOUNTED_PRICE= (percentOff: string) => `//div[./span[text()='Plan']]//div[./span[text()='MONTHLY PAYMENT (${percentOff} off)']]//span[@class='discounted-price-text']`;
    static CARD_ONE_PER_MONTH_TEXT= (percentOff: string) => `//div[./span[text()='Plan']]//div[./span[text()='MONTHLY PAYMENT (${percentOff} off)']]//span[text()='per month']`;
    static CARD_ONE_PLAN_CONTENT= (percentOff: string) => `//div[./span[text()='Plan']]//div[./span[text()='MONTHLY PAYMENT (${percentOff} off)']]//div[@class='plan-content']`;

}
