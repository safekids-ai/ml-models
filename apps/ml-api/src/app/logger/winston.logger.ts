import {createLogger, format, transports} from "winston";

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
const prodLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({stack: true}),
    format.json()
  ),
  transports: [
    new transports.File(options.file),
    new transports.File({
      filename: 'api.log',
      level: 'info'
    })
  ]
}

// export log instance based on the current environment
const instanceLogger = (process.env.NODE_ENV === 'production') ? prodLogger : devLogger

export const instance = createLogger(instanceLogger);

