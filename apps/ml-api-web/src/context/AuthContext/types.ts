export type LoginRequest = {
    email: string;
    password: string;
};
export type VerifySignupRequest = {
    code: string;
};

export type VerifyLoginRequest = {
    username: string;
    password: string;
    code: string;
};

export type CreateNewPasswordResponse = {
    password: string;
};

export type ForgotPasswordResponse = {
    resetCodeSent?: boolean;
};

export type VerifyForgotPasswordCodeResponse = {
    codeVerified?: boolean;
};
