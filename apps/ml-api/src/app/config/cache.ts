
export interface CacheConfig {
  ttl: number,
  max: number
}

export default () => ({
  cacheConfig: {
    ttl: parseInt(process.env.CACHE_TTL, 10) || 60000,
    max: parseInt(process.env.CACHE_MAX, 10) || 1000,
  } as CacheConfig
});

