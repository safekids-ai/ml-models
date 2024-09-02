import {number} from "yup";

export interface RedisConfig {
  host: string,
  port: number,
  ttl: number,
  password: string
}

export default () => ({
  redisConfig: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    ttl: parseInt(process.env.REDIS_TTL, 10) || 3600,
    password: process.env.REDIS_PASSWORD || '',
  } as RedisConfig
});
