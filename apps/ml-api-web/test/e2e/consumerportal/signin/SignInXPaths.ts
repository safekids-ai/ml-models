export class SignInXPaths {
    static SIGN_IN_TEXT: string = "//h4[text()='Sign In']";
    static DONT_HAVE_ACCOUNT_TEXT: string = '//div[text()="Don\'t have an account?"]';
    static SIGN_UP_BUTTON: string = '//div[text()="Don\'t have an account?"]//a[@href="/signup"]';
    static EMAIL_INPUT: string = "//input[@name='email']";
    static PASSWORD_INPUT: string = "//input[@name='password']";
    static EYE_ICON: string = "//input[@name='password']/following-sibling::button//*[name()='svg']";
    static SIGN_IN_BUTTON: string = "//button[@id='signIn-button']";
    static SIGN_IN_DISABLED_BUTTON: string = "//button[@id='signIn-button' and @disabled]";
    static FORGOT_PASSWORD_TEXT: string = "//div[text()='Forgot Password?']";
    static CLICK_HERE_BUTTON: string = "//button[@type='button']//span[text()='Click here']";
    static INVALID_CREDENTIALS_TOAST_MESSAGE: string = "//div[text()='Invalid credentials']";
}
