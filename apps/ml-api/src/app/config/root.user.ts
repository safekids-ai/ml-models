export interface RootUserConfig {
  EMAIL: string
  PASSWORD: string
  FIRST_NAME: string
  LAST_NAME: string
  SCHOOL_DISTRICT_NAME: string
  SCHOOL_NAME: string
}

export default () => ({
  rootUserConfig: {
    EMAIL: process.env.ROOT_EMAIL || 'ali.ammad@emumba.com',
    PASSWORD: process.env.ROOT_PASSWORD || 'safeKids.123AA',
    FIRST_NAME: process.env.FIRST_NAME || 'root',
    LAST_NAME: process.env.LAST_NAME || 'user',
    SCHOOL_DISTRICT_NAME: process.env.SCHOOL_DISTRICT_NAME || 'school district',
    SCHOOL_NAME: process.env.SCHOOL_NAME || 'safe kids school',
  } as RootUserConfig
});
