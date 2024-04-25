import {createLogger, format, transports, Logger} from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// custom log display format
const customFormat = format.printf(({timestamp, level, stack, message}) => {
  return `${timestamp} - [${level.toUpperCase().padEnd(7)}] - ${stack || message}`
})

const options = {
  file: {
    filename: 'error.log',
    level: 'error'
  },
  console: {
    level: 'silly'
  }
}

// for development environment
const devLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({stack: true}),
    customFormat
  ),
  transports: [new transports.Console(options.console)]
}

// for production environment
const prodLogger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new DailyRotateFile({
      filename: 'logs/%DATE%-api.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // Optionally compress old log files
      maxSize: '20m',     // Maximum size of each log file
      maxFiles: '7d',     // Retain logs for 7 days
      level: 'info'
    }),
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple() // or use your preferred console log format
      ),
      level: 'info'
    })
  ]
});

// export log instance based on the current environment
const instanceLogger = (import.meta.env.PROD) ? prodLogger : devLogger
const logger = createLogger(instanceLogger)

export default logger
