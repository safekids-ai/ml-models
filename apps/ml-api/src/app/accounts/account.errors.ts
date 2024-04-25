export class AccountErrors {
    static notFound = (accountId: string): string => {
        return `User with account id: ${accountId} not found.`;
    };

    static domainNotFound = (domain: string): string => {
        return `Account does not exists for domain '${domain}'.`;
    };

    static nonAdmin = (): string => {
        return `Kindly use non admin account.`;
    };

    static adminLink = (): string => {
        return `Please login as an administrator.`;
    };

    static emailExists = (email: string): string => {
        return `User with email: ${email} already exists.`;
    };

    static objectLocked = (attempts: number): string => {
        return `Object is locked after maximum failed attempts ${attempts}`;
    };

    static sessionExpired = (): string => {
        return `Session has been expired.`;
    };
}
