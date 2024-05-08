export class AuthErrors extends Error {
    static unAuthorized = (error): string => {
        return `Login Failed. ${error}`;
    };

    static badRequest = (error): string => {
        return `Login Failed. ${error}`;
    };
}
