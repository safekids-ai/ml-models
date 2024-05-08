const h4 = 'Websites that are always allowed';
const dropdownLabel = 'Choose a family member:';
export class WebsitesXPaths {
    static WEBSITES_HEADING: string = `//h4[text()='${h4}']`;
    static CHOOSE_FAMILY_TEXT: string = `//div[./h4[text()='${h4}']]//span[text()='${dropdownLabel}']`;
    static SELECTED_KID_INPUT: string = `//div[./h4[text()='${h4}']]//span[text()='${dropdownLabel}']/following-sibling::div//input[@name='selectedKidData']`;
    static CATEGORY_FOOTER_NOTE = (str1: string, str2: string, str3: string): string =>
        `//div[./h4[text()='Categories']]//p[text()='${str1}' and text()='${str2}']//span[text()='${str3}']`;
    static SAVE_DISABLED: string = `//div[./h4[text()='${h4}']]//button[@disabled][./span[text()='Save']]`;
    static SAVE_ENABLED: string = `//div[./h4[text()='${h4}']]//button[./span[text()='Save']]`;
    static SELECT_KID = (str1: string): string => `//ul//li[text()='${str1}']`;
    static KID_VISIBLE_INPUT = (str1: string): string => `//div[./h4[text()='${h4}']]//div[text()='${str1}']/following-sibling::input`;
    static WEBSITES_UPDATED_SUCCESSFULLY: string = "//div[text()='Websites updated successfully']";
    static WEBSITES_DELETED_SUCCESSFULLY = (name: string): string => `//div[text()='Website ${name} deleted successfully']`;
    static LIST: string = `//div[./h4[text()='${h4}']]//ul`;
    static LISTITEM: string = `//div[./h4[text()='${h4}']]//ul/li`;
    static WEBSITE_URL = (url: string): string => `//div[./h4[text()='${h4}']]//ul//li//a[text()='${url}']`;
    static CANCEL_BTN_WEBSITE_URL: string = `//div[./h4[text()='${h4}']]//ul//li//div[2]`;
    static ENTER_WEBSITE_INPUT: string = `//div[./h4[text()='${h4}']]//input[@name='add-websites-input']`;
    static ADD_WEBSITE_BUTTON: string = `//div[./h4[text()='${h4}']]//button[@id='test-Add-btn']`;
    static ADD_WEBSITE_BUTTON_DISABLE: string = ` //div[./h4[text()='${h4}']]//button[@id='test-Add-btn' and @disabled]`;
    static DELETE_URL_BTN = (url: string): string =>
        `//div[./h4[text()='${h4}']]//ul//li//a[text()='${url}']/parent::span/parent::div/following-sibling::div[text()='x']`;
}
