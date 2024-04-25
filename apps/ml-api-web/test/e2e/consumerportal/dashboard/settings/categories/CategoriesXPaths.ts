export class CategoriesXPaths{
    static CATEGORIES_HEADING: string = "//h4[text()='Categories']";
    static CHOOSE_FAMILY_TEXT: string = "//div[./h4[text()='Categories']]//span[text()='Choose a family member:']";
    static SELECTED_KID_INPUT: string = "//div[./h4[text()='Categories']]//span[text()='Choose a family member:']/following-sibling::div//input[@name='selectedKid']";
    static TABLE_HEADER = (str1: string, str2: string): string => `//div[./h4[text()='Categories']]//table//thead//tr//div//span[text()='${str1}']/following-sibling::span[text()='${str2}']`;
    static CATEGORY_RADIO_BUTTON = (str1: string, str2: string): string => `(//div[./h4[text()='Categories']]//table//tbody//tr//th[./span[text()='${str1}']]/following-sibling::td)[${str2}]//input[@type='radio']`;
    static CATEGORY_FOOTER_NOTE = (str1: string, str2: string, str3: string): string => `//div[./h4[text()='Categories']]//p[text()='${str1}' and text()='${str2}']//span[text()='${str3}']`;
    static SAVE_DISABLED: string = "//div[./h4[text()='Categories']]//button[@disabled][./span[text()='Save']]";
    static SAVE_ENABLED: string = "//div[./h4[text()='Categories']]//button[./span[text()='Save']]";
    static SELECT_KID = (str1: string): string => `//ul//li[text()='${str1}']`;
    static KID_VISIBLE_INPUT = (str1: string): string => `//div[./h4[text()='Categories']]//div[text()='${str1}']/following-sibling::input`;
    static CATEGORIES_STATUS_UPDATED_SUCCESSFULLY: string = "//div[text()='Categories status updated successfully']";

}