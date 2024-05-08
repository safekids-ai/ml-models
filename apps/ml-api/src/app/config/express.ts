export interface ExpressConfig {
  environment: string,
  port: number
  isDevelopment(): boolean
}
export default () => ({
  expressConfig: {
    environment: process.env.APP_ENV || 'development',
    port: process.env.EXPRESS_PORT || 3000,

    // helpers
    isDevelopment() {
      return this.environment === 'development';
    },

    isProduction() {
      return this.environment === 'production';
    },

    getExpressPort() {
      return this.port;
    },
  } as ExpressConfig
});
