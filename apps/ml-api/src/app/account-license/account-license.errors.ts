export class AccountLicenseErrors {
    static expired = (date: Date, accountId: string): string => {
        return `License has been expired on ${date} for account id: ${accountId}.`;
    };

    static notFound = (accountId: string): string => {
        return `License not found for account id: ${accountId}.`;
    };

    static invalid = (): string => {
        return `Invalid License.`;
    };
}
