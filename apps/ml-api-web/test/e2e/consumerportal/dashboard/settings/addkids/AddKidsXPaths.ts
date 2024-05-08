export class AddKidsXPaths {
    static ADD_KID_HEADING: string = "//span[text()='Add Kid']";
    static Kid_PRESENT = (firstName: string, lastName: string, dateOfBirth: string): string =>
        `//div[./span[text()='Add Kid']]//div[./input[@value='${firstName}']]/parent::div/following-sibling::div//input[@value='${lastName}']/parent::div/parent::div/following-sibling::div//input[@value='${dateOfBirth}']`;
    static FIRST_NAME_INPUT: string = "(//div[./span[text()='Add Kid']]//label[text()='First Name']/following-sibling::div//input)";
    static FIRST_NAME_WITH_VALUE = (firstName: string): string =>
        `//div[./span[text()='Add Kid']]//label[text()='First Name']/following-sibling::div//input[@value='${firstName}']`;
    static LAST_NAME_INPUT: string = "(//div[./span[text()='Add Kid']]//label[text()='Last Name']/following-sibling::div//input)";
    static LAST_NAME_WITH_VALUE = (lastName: string): string =>
        `//div[./span[text()='Add Kid']]//label[text()='Last Name']/following-sibling::div//input[@value='${lastName}']`;
    static YEAR_OF_BIRTH_DROPDOWN: string = "(//div[./span[text()='Add Kid']]//label[text()='Year of Birth']/following-sibling::div//input)";
    static YEAR_OF_BIRTH_DROPDOWN_WITH_VALUE = (yearOfBirth: string): string =>
        `//div[./span[text()='Add Kid']]//label[text()='Year of Birth']/following-sibling::div//input[@value='${yearOfBirth}']`;
    static SELECT_YEAR_A: string = "//ul[./li[@data-value]]//li[@data-value='";
    static SELECT_YEAR_B: string = "']";
    static REMOVE_BUTTON = (firstName: string): string =>
        `//div[./span[text()='Add Kid']]//div[./input[@value='${firstName}']]/parent::div/parent::div//div[text()='Remove']`;
    static GENERAL_REMOVE_BUTTON: string = "(//div[./span[text()='Add Kid']]//div[text()='Remove'])";
    static ADD_MORE_BUTTON: string = "//div[./span[text()='Add Kid']]//button[./span[text()='ADD MORE']]";
    static SAVE_BUTTON: string = "//div[./span[text()='Add Kid']]//button[./span[text()='Save']]";
    static KID_ADDED_SUCCESSFULLY_TEXT: string = "//div[text()='Kid added successfully']";
    static SAVE_BUTTON_DISABLED: string = "//div[./span[text()='Add Kid']]//button[@disabled][./span[text()='Save']]";
    static WANT_TO_ADD_ADDITIONAL_MEMBERS_TEXT: string =
        "//div[./span[text()='Add Kid']]//button[./span[text()='ADD MORE']]/following-sibling::span[text()='Want to add additional family members? Press add more button']";
}
