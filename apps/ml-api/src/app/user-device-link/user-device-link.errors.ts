export class UserDeviceLinkErrors {
    static registerKid = (err = ''): string => {
        return `An error occurred while registering kid: ${err}`;
    };
}
