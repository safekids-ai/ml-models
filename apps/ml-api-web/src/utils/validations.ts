import { any, map, trim, filter, match, includes, split } from 'ramda';
import { PhoneNumberUtil, PhoneNumber } from 'google-libphonenumber';
import { isSomething, isNothing } from './helpers';

export const validateName = (name: string, label: string) => {
    if (!name || trim(name) === '') return `${label} is required`;
    if (!/^[a-zA-Z ]+$/.test(name)) return `${label} can only contain alphabets`;
};
export const validateSchoolName = (name: string, label: string) => {
    if (!name || trim(name) === '') return `${label} is required`;
};

export const validateFullName = (name: string, label: string) => {
    if (!name) return `${label} is required`;
    const names = filter((word) => trim(word).length > 0, name.split(' '));
    const error = any(
        isSomething,
        map((name) => validateName(name, 'Full Name'), names)
    );
    return error ? 'Please enter full name' : undefined;
};
export const validateEmail = (email: string) => {
    return /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/.test(email) ? undefined : 'Please enter a valid email address';
};
export const validateSchoolEmail = (email: string) => {
    return /^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.edu$/.test(email) ? undefined : 'Please enter a valid School Email address i.e ends with .edu';
};
export const validatePassword = (password: string) => {
    if (!password) return `Password is required`;
    if (password.length < 8) return `Password must contain atleast 8 characters`;
    else if (password.length > 20) return 'Password must be at most 20 characters long';
    else if (includes(' ', password)) return 'Password cannot contain spaces';
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    if (match(passwordRegex, password).length === 0) {
        return 'Password must contain a small letter, a capital letter and a number';
    }
};

export const validateYear = (text: string): string | undefined => {
    const currentYear = new Date().getFullYear();
    const year = parseInt(text);
    const str = text && text.toString();
    //return error if year is not a number or more than 50 years ago from current year
    return !str || !str.match(/^[0-9]{1,}$/) || year > currentYear || year < currentYear - 50 ? 'Please enter valid year' : undefined;
};
export function validatePhoneNumber(value: string, label: string) {
    const numberRegex = new RegExp('^[+][0-9]*$');
    if (!numberRegex.test(value)) {
        return 'Please enter a valid number';
    }
    if (!value) return `${label} is required`;

    const phoneUtil = PhoneNumberUtil.getInstance();

    try {
        const phoneNum = phoneUtil.parseAndKeepRawInput(value);
        const source = phoneNum.getCountryCodeSource();
        if (source !== PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_PLUS_SIGN) return 'Phone number must include country code';

        const valid = phoneUtil.isValidNumber(phoneNum);

        return valid ? undefined : 'Please enter a valid number';
    } catch (ex) {
        return 'Please enter a valid phone number with country code';
    }
    // if (
    //   !/^(1\s?)?((\([0-9]{3}\))|[0-9]{3})[\s-]?[\0-9]{3}[\s-]?[0-9]{4}$/.test(
    //     value.replace("+", "")
    //   )
    // )
    //   return `${label} can only contain number`;
}

export function validateEmergencyContactPhone(value: string) {
    // eslint-disable-next-line no-useless-escape
    return /^[\+]?(\d{1})?(\d{1})?(\s)?[(]?[0-9]{3}[)]?[-\s\.]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{4,6}$/.test(value) ? undefined : 'Please enter a valid number';
}

export function cardNumberValidation(value: string) {
    if (!value) return `Card number is required`;
    if (
        !/^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/.test(
            value.replace(/ /g, '')
        )
    )
        return `Enter valid card number`;
}
export function cardExpiryDateValidation(value: string) {
    if (!value) return `Expiry date is required`;
    if (!/\b(0[1-9]|1[0-2])\/?([0-9]{2})\b/.test(value)) return `Enter valid expiry date`;
    const [month, year] = split('/', value);
    if (isNothing(month) || isNothing(year)) return 'Enter valid date';
    const currentYear = new Date().getFullYear() - 2000;
    if (parseInt(year, 10) < currentYear) return 'Invalid year entered';
    else if (parseInt(year) === currentYear) {
        const currentMonth = new Date().getMonth();
        if (parseInt(month) < currentMonth + 1) return 'Invalid month entered';
    }
}
export function cardCVCValidation(value: string) {
    if (!value) return `Expiry date is required`;
    if (!/^[0-9]{3,4}$/.test(value)) return `Enter valid CVC number`;
}
export function validatePostalCode(text: string) {
    const str = text && text.toString();
    return !str || !str.match(/^[0-9]{5}$/) || str.length < 5 || str.length > 5 ? 'Please enter valid postal code' : undefined;
}
export function validateURL(url: string): string | undefined {
    return /\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b/.test(url) ? undefined : 'Please enter a valid website url';
}

export function validateProcessName(name: string): string | undefined {
    // eslint-disable-next-line no-useless-escape
    const reservedCharacters = /^[^\\/:\*\?"<>\|]+$/; // reserved characters \ / : * ? " < > |
    const reservedNames = /^(AUX|NUL|PRN|CON|LPT[0-9]|COM[0-9])(\.|$)/i; // case-insensitive reserved words and forbidden file names
    return reservedCharacters.test(name) && !reservedNames.test(name) ? undefined : 'Invalid process name';
}

export function validateWebsite(url: string): string | undefined {
    // eslint-disable-next-line no-useless-escape
    const regex = /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z@:%_\+.~#?&//=]*)/gi;
    const found = url.match(regex);
    if (found && found.length === 1) {
        return found[0] === url ? undefined : 'Please enter a valid website url';
    } else return 'Please enter a valid website url';
}
