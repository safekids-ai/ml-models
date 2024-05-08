export class UserErrors {
    static notFound = (id: string): string => {
        return `No code found with user id: ${id}.`;
    };

    static emailExists = (email: string): string => {
        return `User with email: ${email} already exists.`;
    };

    static emailNotExists = (email: string): string => {
        return `User with email: ${email} does not exists.`;
    };

    static invalidCredentials = (): string => {
        return `Invalid credentials.`;
    };

    static invalidCode = (): string => {
        return `Invalid code was provided.`;
    };

    static usersExist = (users: string[]): string => {
        return `The following users already exists : [${users}] `;
    };

    static invalidYear = (users: string[]): string => {
        return `The following users contains invalid year of birth : [${users}]. The yearOfBirth must be 4 digit.`;
    };

    static nameMissing = (): string => {
        return `First name and last name must be provided.`;
    };

    static duplicatedKids = (): string => {
        return `Duplicate kids are not allowed. `;
    };

    static accessLimitAlreadyCleared = (name: string): string => {
        return `The access limit for ${name} has already been cleared`;
    };
}
