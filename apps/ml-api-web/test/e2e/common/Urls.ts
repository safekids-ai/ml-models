export class Urls {
    static signInURL: string = `${process.env.FRONTEND_URL}signin`;
    static signUpURL: string = `${process.env.FRONTEND_URL}signup`;

    static async setupSignInURL(url: string) {
        return `${url}signin`;
    }

    static async setupSignUpURL(url: string) {
        return `${url}signup`;
    }
}
