export class RosterApiErrors {
    static fetchUsers = (): string => {
        return `An error occurred while fetching user by roster apis.`;
    };

    static fetchUnits = (): string => {
        return `An error occurred while fetching organizational units by roster apis.`;
    };

    static fetchEnrollments = (): string => {
        return `An error occurred while fetching enrollments by roster apis.`;
    };

    static fetchClasses = (): string => {
        return `An error occurred while fetching classes by roster apis.`;
    };

    static accessToken = (): string => {
        return `An error occurred while generating access token.`;
    };
}
