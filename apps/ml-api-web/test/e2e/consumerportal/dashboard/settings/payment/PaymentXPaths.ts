export class PaymentXPaths {
    static PAYMENT_HEADING: string = `//span[text()='Payment']`;
    static PAYMENT_TEXT_1 = (date: string, days: number) =>
        `//div[./span[text()='Payment']]//span[text()="You are currently in a free trial, which will end in ${days} days (${date}). After the free trial, you will be charged $17.99 monthly. "]`;
    static PAYMENT_TEXT: string = `//div[./span[text()='Payment']]//span[@class='trial-status']`;
    static VIEW_PLAN_BUTTON: string = `//div[./span[text()='Payment']]//span[text()="View Plan"]`;
    static CLOSE_PLAN_BUTTON: string = `//div[./span[text()='Payment']]//span[text()="Close Plan"]`;
    static CHANGE_BUTTON: string = `//div[./span[text()='Payment']]/following-sibling::button[@type='submit']//span[text()='CHANGE']`;
    static PAYMENT_TEXT_2: string = `//div[./span[text()='Payment']]/parent::div/parent::div//span[text()="Currently, you don't have any payment method. Please add a payment method."]`;
    static PAYMENT_TEXT_2a: string = `//div[./span[text()='Payment']]/parent::div/parent::div//span[text()='The card you provided is currently being charged.']`;
    static PAYMENT_TEXT_2b = (details: string) => `//div[./span[text()='Payment']]/parent::div/parent::div//span[text()='${details}']`;
    static PAYMENT_ENDING_TEXT: string = `//div[./span[text()='Payment']]/parent::div/parent::div//span[@class='text']//a[text()='support@safekids.ai']`;

    static PLAN_NAME_HEADING: string = `(//div[./span[text()='Plan']]//span[@class='plan-name-heading'])[2]`;



}
