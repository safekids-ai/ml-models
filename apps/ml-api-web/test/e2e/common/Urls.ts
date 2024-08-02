export class Urls {
    static signInURL: string = `${import.meta.env.PUBLIC_URL}signin`;
    static signUpURL: string = `${import.meta.env.PUBLIC_URL}signup`;

    static async setupSignInURL(url: string) {
        return `${url}signin`;
    }

    static async setupSignUpURL(url: string) {
        return `${url}signup`;
    }
}
