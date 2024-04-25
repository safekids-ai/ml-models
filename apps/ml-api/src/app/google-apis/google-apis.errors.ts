export class GoogleApisErrors {
    static fetchUsers = (): string => {
        return `An error occurred while fetching user by google apis.`;
    };

    static fetchUnits = (): string => {
        return `An error occurred while fetching organizational units by google apis.`;
    };

    static accessToken = (): string => {
        return `An error occurred while generating access token.`;
    };

    static emailNotExists = (email: string): string => {
        return `User with email: ${email} does not exists.`;
    };

    static noUsers = (error?: string): string => {
        return `No users found.. ${error}.`;
    };

    static profile = (error?: string): string => {
        return `An error occurred when fetching profile from google apis.. ${error}.`;
    };

    static contactAdmin = (): string => {
        return `Please contact your administrator.`;
    };

    static fetchUser = (email?: string): string => {
        return `An error occurred while fetching user from google apis by email..${email}.`;
    };
}
