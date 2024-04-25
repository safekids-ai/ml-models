export interface GoogleApiConfig {
  client_id: string,
  client_secret: string,
  refresh_token: string,
  access_token: string,
}

export default () => ({
  googleApiConfig : {
    client_id: process.env.GOOGLE_API_CLIENT_ID,
    client_secret: process.env.GOOGLE_API_CLIENT_SECRET,
    refresh_token: process.env.GOOGLE_API_REFRESH_TOKEN,
    access_token: process.env.GOOGLE_API_ACCESS_TOKEN,
  } as GoogleApiConfig
});
