export interface TwilioConfig {

  accountSid: string
  authToken: string
  phoneNumber: string
  retryOptions: {
    retries: number,
    factor: number,
    minTimeout: number,
    maxTimeout: number,
  },
}

export default () => ({
  twilioConfig: {
    accountSid: process.env.TWILIO_ACCOUNTSID,
    authToken: process.env.TWILIO_AUTHTOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    retryOptions: {
      retries: 12,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 10000,
    },
  } as TwilioConfig
});
