export class SignUpXPaths {
    static CREATE_AN_ACCOUNT_TEXT: string = "//h4[text()='Create an Account']";
    static ALREADY_HAVE_AN_ACCOUNT_TEXT: string = "//div[text()='Already have an account?']";
    static SIGN_IN_BUTTON: string = "//span[text()='Sign In']";
    static FIRST_NAME_INPUT: string = "//input[@name='firstName']";
    static LAST_NAME_INPUT: string = "//input[@name='lastName']";
    static EMAIL_INPUT: string = "//input[@name='email']";
    static PASSWORD_INPUT: string = "//input[@name='password']";
    static UNHIDDEN_PASSWORD: string = "//input[@name='password' and @type='text']";
    static PASSWORD_EYE_ICON: string = "//input[@name='password']/following-sibling::button//*[name()='svg']";
    static INFORMATION_ICON: string = "//div[@class='password-strength-bar']/following-sibling::div//*[name()='svg']";
    static PASSWORD_STRENGTH_BAR_WITHOUT_COLOR: string = "//div[@class='password-strength-bar-item ']";
    static PASSWORD_STRENGTH_BAR_WITH_COLOR: string = "//div[@class='password-strength-bar-item colored']";
    static SIGNUP_BUTTON_DISABLED: string = "//button[@type='submit' and @disabled]";
    static SIGNUP_BUTTON: string = "//button[@type='submit']";
    static BY_PROCEEDING_TEXT: string = '//span[text()="Safe Kids’"]';
    static SERVICES_TERMS_LINK: string = "//a[text()='Services Terms']";
    static AND_CONFIRM_TEXT: string = "//span[text()='and']";
    static PRIVACY_POLICY_LINK: string = "//a[text()='Privacy Policy.']";
    static WRONG_FORMAT_PASSWORD_TOAST_MESSAGE: string =
        "//div[text()='Your password should be between 8-20 characters and must be a combination of small letters, capital letters and numbers.']";
    static SPACES_ARE_NOT_ALLOWED_TEXT: string = "//div[text()='Spaces are not allowed']";
    static ALREADY_EXIST_TOAST_MESSAGE_PART1: string = "//div[text()='User with email: ";
    static ALREADY_EXIST_TOAST_MESSAGE_PART2: string = " already exists.']";

    static EMAIL_VERIFICATION_TEXT: string = "//h4[text()='Email Verification']";
    static TEXT_BELOW_EMAIL_VERIFICATION: string =
        "//h4[text()='Email Verification']/following-sibling::div[text()='A message with a verification code has been sent to your email.']";
    static INPUT_FIELD_EMAIL: string = "//div[text()='A message with a verification code has been sent to your email.']/following-sibling::div//input";
    static TOAST_MESSAGE_PLEASE_ENTER_CODE: string = "//div[text()='Please enter verification code sent to your email']";
    static DISABLED_VERIFY: string = "//div[./button[@type='submit']]//button[@type='submit' and @disabled][./span[text()='Verify']]";
    static VERIFY_BUTTON: string = "//div[./button[@type='submit']]//button[@type='submit'][./span[text()='Verify']]";
    static HAVENT_RECEIVED_CODE: string = '//div[text()="Haven\'t received code?"]';
    static RESEND_BUTTON: string = "//div[text()=\"Haven't received code?\"]//span[text()='Resend']";
}
