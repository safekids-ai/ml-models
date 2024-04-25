export class UserErrors extends Error {
    static notFound = (accountId: string): string => {
        return `User with id: ${accountId} not found.`;
    };

    static codeNotFound = (code: string): string => {
        return `User with access code: ${code} not found.`;
    };

    static couldNotCreate = (userEmail: string, error: string): string => {
        return `Error occurred wile creating user [${userEmail}]. Error: ${error}`;
    };

    static emailExists = (email: string): string => {
        return `User with email: ${email} already exists.`;
    };

    static sessionExpired = (): string => {
        return `Session has been expired.`;
    };
}
