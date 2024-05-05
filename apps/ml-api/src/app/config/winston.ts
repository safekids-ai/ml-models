import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import 'winston-daily-rotate-file';
const devWinstonConfig = {
    file: {
        level: 'debug',
        filename: 'safekids.logs.%DATE%.log',
        dirname: `logs/`,
        handleExceptions: true,
        json: false,
        colorize: true,
        format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike('SafeKidsApi')),
    },
    console: {
        level: 'debug',
        handleExceptions: true,
        json: true,
        colorize: true,
        prettyPrint: true,
        format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike('SafeKidsApi')),
    },
};
winston.transports;
const prodWinstonConfig = {
    file: {
        level: 'info',
        filename: 'safekids.logs.%DATE%.log',
        dirname: `logs/`,
        handleExceptions: true,
        json: false,
        format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike('SafeKidsApi')),
    },
    console: {
        level: 'error',
        handleExceptions: true,
        json: false,
        colorize: true,
        prettyPrint: true,
        // format: winston.format.timestamp()
        format: winston.format.combine(winston.format.timestamp(), nestWinstonModuleUtilities.format.nestLike()),
    },
};

const isDev = process.env.NODE_ENV != 'production';

export const winstonTransports = () => {
    const file = isDev ? devWinstonConfig.file : prodWinstonConfig.file;
    const console = isDev ? devWinstonConfig.console : prodWinstonConfig.console;
    const consoleTransport = new winston.transports.Console(console);
    const fileTransport = new winston.transports.DailyRotateFile(file);
    return [consoleTransport, fileTransport];
};

export const winstonOptions = () => {
    return {
        transports: winstonTransports(),
        exitOnError: false,
    };
};

export default () => ({
  logger_config: winstonOptions(),
});

