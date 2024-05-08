export type FieldError = {
    property: string;
    children: any[];
    constraints: { [type: string]: string };
};
export type Error = string | FieldError[];

type LoginSuccessResponse = { jwt_token: string };
type LoginRequire2FAResponse = {
    twoFactorEnabled: string;
    twoFactorType: string;
    message: string;
};
export type LoginResponse = LoginSuccessResponse | LoginRequire2FAResponse;
export type VerifyLoginResponse = Error | LoginSuccessResponse;

type SignupSuccessResponse = LoginSuccessResponse;
type SignupErrorResponse = Error;
export type SignupResponse = SignupSuccessResponse | SignupErrorResponse;

export type SignupVerifyResponse = {
    emailVerified?: boolean;

    twoFactorEnabled?: boolean;
    twoFactorType?: string;
    code?: string; //only returned during development
};

export type AddGuardianResponse = Error | { userId: string };
export type UpdateGuardianResponse = Error | {};

export type AddKidResponse = Error | { kidId: string };

export type UpdateKidResponse = Error | { kidUpdated: boolean };
export type DeleteKidResponse = Error | { kidDeleted: boolean };

export type UpdateNotificationStatusResponse = {
    notificationsUpdated: boolean;
};

export type CreateKidDeviceLinkResponse = {
    loginId: string;
};

export type GetUserProfileResponse = {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    primaryAccount: boolean;
    phoneNumber: string;
    lastLoginDateTime: string;
    accountType: 'consumer' | 'school';
    avatar?: string;
    thumbnailPhotoUrl?: string;
};

export type GetPaymentDetails = {
    paymentMethod: {
        lastDigits: string;
        expiryMonth: number;
        expiryYear: number;
    };
};
