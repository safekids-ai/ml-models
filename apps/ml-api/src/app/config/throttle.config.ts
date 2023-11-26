export default () => ({
  throttle_config: process.env.TROTTLE_CONFIG ||
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
    ]
});

