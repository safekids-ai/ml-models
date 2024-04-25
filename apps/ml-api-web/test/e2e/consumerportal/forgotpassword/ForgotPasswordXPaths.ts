export class ForgotPasswordXPaths {
    static FORGOT_PASSWORD_TEXT: string = "//h4[text()='Forgot Password']";
    static SIX_DIGIT_CODE: string = "//input[@type='text' and @maxlength='1']";
    static BACK_BUTTON: string = "//span[text()=' Back']";
    static LETS_GET_YOU_BACK_TEXT: string = '//div[text()="Let\'s get you back on track"]';
    static EMAIL_INPUT: string = "//input[@name='email']";
    static SUBMIT_BUTTON: string = "//button[@type='submit']";
    static SUBMIT_DISABLED_BUTTON: string = "//button[@type='submit' and @disabled]";
    static TOAST_MESSAGE_PART1: string = "//div[text()='User with email: ";
    static TOAST_MESSAGE_PART2: string = " does not exists.']";
    static HAVENT_RECEIVE_EMAIL_TEXT: string = '//div[text()="Haven\'t received email?"]';
    static RESEND_BUTTON: string = "//div[text()=\"Haven't received email?\"]//button[@type='button']";
    static TOAST_MESSAGE_INVALID_CODE: string = "//div[text()='Invalid code']";
    static CREATE_NEW_PASSWORD_TEXT: string = "//h4[text()='Create New Password']";
    static CHOOSE_EIGHT_CHARACTER_PASSWORD_TEXT: string =
        "//h4[text()='Create New Password']/following-sibling::div[text()='Choose minimum 8 character password']";
    static HIDDEN_PASSWORD_INPUT_FIELD: string = "//input[@name='password' and @type='password']";
    static UNHIDDEN_PASSWORD_INPUT_FIELD: string = "//input[@name='password' and @type='text']";
    static COLORED_PASSWORD_STRENGTH_BAR: string = "//div[@class='password-strength-bar']//div[@class='password-strength-bar-item colored']";
    static PASSWORD_STRENGTH_BAR: string = "//div[@class='password-strength-bar']//div[@class='password-strength-bar-item ']";
    static EYE_ICON: string = "//input/following-sibling::button[@type='button']";
    static I_ICON: string = "//div[@class='password-strength-bar']/following-sibling::div//*[name()='svg']";
    static WRONG_FORMAT_PASSWORD_TOAST_MESSAGE: string =
        "//div[text()='Your password should be between 8-20 characters and must be a combination of small letters, capital letters and numbers.']";
    static WRONG_FORMAT_PASSWORD_TOAST_MESSAGE_2: string = "//div[text()='Spaces are not allowed']";
}
