export const errorMessage = 'Some error occured';
export const invalidCredentials = 'Invalid credentials';
export const noNetworkConnection = 'Could not connect to the server';

export const invalidCode = 'Please enter a valid code';
export enum RequestType {
    Signup,
    SignupVerify,
    AssignKidToAccount,
    DeleteAccountForKid,
    AddGuardian,
    UpdateGuardian,
    DeleteGuardian,
    AddKid,
    UpdateKid,
    DeleteKid,
    CreateNewPassword,
    ForgotPassword,
    ChangePassword,
    UpdateProfile,
    Enable2FA,
}
export const ErrorMessages = {
    [RequestType.Signup]: {
        firstName: {
            isNotEmpty: 'First name is required',
        },
        lastName: {
            isNotEmpty: 'First name is required',
        },
        email: {
            isNotEmpty: 'Email is required',
            isEmail: 'Please enter a valid email address',
        },
        password: {
            minLength: 'Password must be atleast 8 characters long',
            maxLength: 'Password must be at most 20 characters long',
        },
    },
    [RequestType.SignupVerify]: {
        emailCode: {
            maxLength: 'Code must have 6 characters',
            minLength: 'Code must have 6 characters',
            isNumberString: 'Code must be a number',
            isNotEmpty: 'Code is required',
        },
    },
    [RequestType.AssignKidToAccount]: {
        deviceId: {
            isMongoId: 'Invalid device',
            isNotEmpty: 'Device ID is required',
        },
        kidId: {
            isMongoId: 'Invalid kid',
            isNotEmpty: 'Kid ID is required',
        },
        osLogin: {
            isNotEmpty: 'OS Account is invalid',
        },
    },
    [RequestType.DeleteAccountForKid]: {
        loginId: {
            isMongoId: 'Invalid ID',
            isNotEmpty: 'Login ID is required',
        },
    },

    [RequestType.AddGuardian]: {
        firstName: {
            isNotEmpty: 'First Name is required',
        },
        lastName: {
            isNotEmpty: 'Last Name is required',
        },
        role: {
            isNotEmpty: 'Role is required',
        },
        email: {
            isNotEmpty: 'Email is required',
            isEmail: 'Please enter valid email',
        },
    },
    [RequestType.UpdateGuardian]: {
        firstName: {
            isNotEmpty: 'First Name is required',
        },
        lastName: {
            isNotEmpty: 'Last Name is required',
        },
        userId: {
            isNotEmpty: 'User ID is required',
            isMongoId: 'Invalid User ID',
        },
        role: {
            isNotEmpty: 'Role is required',
        },
    },
    [RequestType.DeleteGuardian]: {
        userId: {
            isNotEmpty: 'User ID is required',
            isMongoId: 'Invalid User ID',
        },
    },
    [RequestType.AddKid]: {
        name: {
            isNotEmpty: 'Name is required',
        },
        gender: {
            isNotEmpty: 'Gender is required',
        },
        yearOfBirth: {
            isNotEmpty: 'Year of birth is required',
        },
    },
    [RequestType.UpdateKid]: {
        kidId: {
            isNotEmpty: 'Kid ID is required',
            isMongoId: 'Invalid kid ID',
        },
        name: {
            isNotEmpty: 'Name is required',
        },
        gender: {
            isNotEmpty: 'Gender is required',
        },
        yearOfBirth: {
            isNotEmpty: 'Year of birth is required',
        },
    },
    [RequestType.DeleteKid]: {
        kidId: {
            isNotEmpty: 'Kid ID is required',
            isMongoId: 'Invalid Kid ID',
        },
    },
    [RequestType.CreateNewPassword]: {
        code: {
            isNotEmpty: 'Code is required',
        },
        newPassword: {
            isNotEmpty: 'New Password is required',
        },
        email: {
            isNotEmpty: 'Email is required',
        },
    },
    [RequestType.ForgotPassword]: {
        email: {
            isNotEmpty: 'Email is required',
            isEmail: 'Please enter valid email',
        },
    },
    [RequestType.ChangePassword]: {
        newPassword: {
            isNotEmpty: 'New Password is required',
        },
        oldPassword: {
            isNotEmpty: 'Old Password is required',
        },
    },
    [RequestType.UpdateProfile]: {
        phoneNumber: {
            isPhoneNumber: 'Please enter a valid phone number',
        },
    },
    [RequestType.Enable2FA]: {
        phoneNumber: {
            isPhoneNumber: 'Please enter a valid phone number',
        },
    },
};
