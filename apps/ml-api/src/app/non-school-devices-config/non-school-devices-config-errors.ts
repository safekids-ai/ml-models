export class NonSchoolDevicesConfigErrors {
    static invalidEmails = (emails: string): string => {
        return `Following emails are not found or they are not students: [${emails}] .`;
    };
}
