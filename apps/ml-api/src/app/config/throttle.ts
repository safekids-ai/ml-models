import {ThrottlerModuleOptions} from "@nestjs/throttler";

export interface ThrottleConfigItem {
  name: string,
  ttl: number,
  limit: number,
}
const isDev = process.env.APP_ENV != 'production'
const prodSetting = process.env.TROTTLE_CONFIG ||
  [
    {
      name: 'short',
      ttl: 1000,
      limit: 10,
    },
    {
      name: 'medium',
      ttl: 10000,
      limit: 20
    },
    {
      name: 'long',
      ttl: 60000,
      limit: 50
    }
  ];

const devSetting = [
  {
    name: 'all',
    ttl: 1000,
    limit: 1000
  }];

export default () => ({
  throttleConfig: (isDev) ? devSetting : prodSetting as ThrottlerModuleOptions,
});

