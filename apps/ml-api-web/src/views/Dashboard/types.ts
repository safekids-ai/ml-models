export type UserProfile = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    primaryAccount: boolean;
    phoneNumber: string;
    lastLoginDateTime: string;
    twoFactorEnabled?: boolean;
    accountType: 'consumer' | 'school';
    avatar?: string;
};
export type StyleProps = {
    isMobile: boolean;
    disableFutureDates?: boolean;
};
