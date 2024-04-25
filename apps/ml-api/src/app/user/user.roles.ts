export enum UserRoles {
    ADMINISTRATOR = 'ADMINISTRATOR',
    DISTRICT_USER = 'DISTRICT_USER',
    KID = 'KID',
    PARENT = 'PARENT',
    STUDENT = 'STUDENT',
    SUPER_ADMIN = 'SUPER_ADMIN',
    TEACHER = 'TEACHER',
}

export const defaultRoles = [
    { id: 'ADMINISTRATOR', role: 'ADMINISTRATOR' },
    { id: 'DISTRICT_USER', role: 'DISTRICT_USER' },
    { id: 'KID', role: 'KID' },
    { id: 'PARENT', role: 'PARENT' },
    { id: 'STUDENT', role: 'STUDENT' },
    { id: 'SUPER_ADMIN', role: 'SUPER_ADMIN' },
    { id: 'TEACHER', role: 'TEACHER' },
];
