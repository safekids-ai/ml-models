export interface PasswordConfig {
  passwordResetExpiryHours: number,
  userPasswordGenerateParams: {
    length: number,
    numbers: boolean,
    lowercase: boolean,
    symbols: boolean,
    uppercase: boolean,
    strict: boolean,
  },
}

export default () => ({
  passwordConfig: {
    passwordResetExpiryHours: 1,
    userPasswordGenerateParams: {
      length: 10,
      numbers: true,
      lowercase: true,
      symbols: true,
      uppercase: true,
      strict: true,
    },
    // helpers
    getPasswordResetExpiryHours() {
      return this.passwordResetExpiryHours;
    },
  } as PasswordConfig
});
