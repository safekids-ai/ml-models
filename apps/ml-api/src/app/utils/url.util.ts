export class UrlParser {
  static parseRedis(redisUrl: string): { host: string; port: number, password: string } {
    try {
      const url = new URL(redisUrl);

      const host = url.hostname;
      const port = url.port ? Number(url.port) : 6379;
      const password = url.password || undefined;

      if (isNaN(port)) {
        throw new Error('Invalid port in Redis URL.');
      }

      return { host, port, password};
    } catch (err) {
      throw new Error('Invalid Redis URL format.');
    }
  }
}
