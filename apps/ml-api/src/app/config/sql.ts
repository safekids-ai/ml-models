export interface SqlConfig {
  options: {
    dialect: string
    host: string,
    port: number,
    username: string,
    password: string,
    database: string,
    autoLoadModels: boolean,
    synchronize: boolean,
  },
}
export default () => ({
  sqlConfig: {
    options: {
      dialect: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: process.env.MYSQL_PORT || 4002,
      username: process.env.MYSQL_USER || 'safekidsdev',
      password: process.env.MYSQL_PASSWORD || 's@fekids',
      database: process.env.MYSQL_DATABASE || 'safekids',
      autoLoadModels: true,
      synchronize: true,
    },
    getSQLOptions() {
      return this.options;
    },
  } as SqlConfig
});
