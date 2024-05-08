export class ActivityXPaths {
    static ACCESS_LIMIT_ALREADY_CLEARED = (childName: string): string => `//div[text()='The access limit for ${childName} has already been cleared']`;
    static ACCESS_LIMIT_CLEARED = (childName: string): string => `//div[text()='The access limit for ${childName} has been cleared']`;
    static NAME_AND_STATUS = (childName: string, childStatus: string): string => `//div[./span[text()='${childName}']]//span[text()='${childStatus}']`;
    static AVATAR = (childName: string, avatarName: string): string => `//div[./span[text()='${childName}']]/parent::div//div[text()='${avatarName}']`;
    static CHILD_ACCESS_LINK = (childName: string, accessLink: string): string =>
        `//div[./span[text()='${childName}']]/following-sibling::span[text()='${accessLink}']`;
    static TOTAL_INTERCEPTS_TEXT = (childName: string): string =>
        `//div[./span[text()='${childName}']]/parent::div/parent::div/following-sibling::div//span[text()='TOTAL INTERCEPTS']`;
    static NUMBER_OF_INTERCEPTS = (childName: string, number: string): string =>
        `//div[./span[text()='${childName}']]/parent::div/parent::div/following-sibling::div//span[text()='${number}']`;
    static NUMBER_OF_INSTANCES_TEXT = (childName: string): string =>
        `//div[./span[text()='${childName}']]/parent::div/parent::div/following-sibling::div//span[text()='number of instances for the top categories']`;
    static TOP_CATEGORIES_TEXT = (childName: string): string =>
        `//div[./span[text()='${childName}']]/parent::div/parent::div/following-sibling::div//table//tr/th[text()='Top categories']`;
    static TOP_CATEGORIES_NUMBER_SIGN = (childName: string): string =>
        `//div[./span[text()='${childName}']]/parent::div/parent::div/following-sibling::div//table//tr/th[text()='#']`;
    static TRIGGERED_CATEGORY = (childName: string, category: string): string =>
        `//div[./span[text()='${childName}']]/parent::div/parent::div/following-sibling::div//table//tbody//tr//td[text()='${category}']`;
    static TRIGGERED_NUMBER = (childName: string, number: string): string =>
        `//div[./span[text()='${childName}']]/parent::div/parent::div/following-sibling::div//table//tbody//tr//td[text()='${number}']`;

    static ASK_FOR_ACCESS_TITLE = (childName: string): string =>
        `//div[./span[text()='${childName}']]/parent::div/parent::div/parent::div//span[text()='PERMANANTLY ALLOW ACCESS TO:']`;
    static ASK_FOR_ACCESS_URL_INPUT = (childName: string, url: string): string =>
        `//div[./span[text()='${childName}']]/parent::div/parent::div/parent::div//span[text()='PERMANANTLY ALLOW ACCESS TO:']/following-sibling::ul//li//p[./a[text()='${url}']]/parent::div/parent::div//input`;
    static ASK_FOR_ACCESS_URL = (childName: string, url: string): string =>
        `//div[./span[text()='${childName}']]/parent::div/parent::div/parent::div//span[text()='PERMANANTLY ALLOW ACCESS TO:']/following-sibling::ul//li//p//a[text()='${url}']`;
    static ASK_FOR_ACCESS_DATE = (childName: string, url: string, date: string): string =>
        `//div[./span[text()='${childName}']]/parent::div/parent::div/parent::div//span[text()='PERMANANTLY ALLOW ACCESS TO:']/following-sibling::ul//li//p[./a[text()='${url}']]/parent::div/parent::div/parent::li//span[text()='${date}']`;
    static ASK_FOR_ACCESS_DISABLE_ADD_BUTTON = (childName: string): string =>
        `//div[./span[text()='${childName}']]/parent::div/parent::div/parent::div//span[text()='PERMANANTLY ALLOW ACCESS TO:']/parent::div//button[@disabled]//span[text()='ADD']`;
    static ASK_FOR_ACCESS_ENABLED_ADD_BUTTON = (childName: string): string =>
        `//div[./span[text()='${childName}']]/parent::div/parent::div/parent::div//span[text()='PERMANANTLY ALLOW ACCESS TO:']/parent::div//button//span[text()='ADD']`;

    static ACCESS_CODE_TEXT = (childName: string): string => `//div[./span[text()='${childName}']]/parent::div/parent::div//span[text()='Access Code']`;
    static ACCESS_CODE_INPUT = (childName: string): string =>
        `//div[./span[text()='${childName}']]/parent::div/parent::div//span[text()='Access Code']/following-sibling::div//input[@type='text']`;
  //  static ACCESS_CODE_TEXT = (childName: string): string => `//div[./span[text()='${childName}']]/parent::div/parent::div//span[text()='Access Code']`;
//    static ACCESS_CODE_INPUT = (childName: string): string =>
 //       `//div[./span[text()='${childName}']]/parent::div/parent::div//span[text()='Access Code']/following-sibling::div//input[@type='text']`;
}
