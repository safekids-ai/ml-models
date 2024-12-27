export type Logger = {
  status: boolean;

  log: (message?: any, ...optionalParams: any[]) => void;
  error: (message?: Error | string, ...optionalParams: any[]) => void;
  enable: () => void;
  disable: () => void;
  enableDebug: () => void;
  disableDebug: () => void;
  debug: (message?: any, ...optionalParams: any[]) => void;
  info: (message?: any, ...optionalParams: any[]) => void;
  warn: (message?: any, ...optionalParams: any[]) => void;
};

export class ConsoleLogger implements Logger {
  private readonly logger: Console;
  public status: boolean;
  public debugEnabled: boolean;

  constructor() {
    this.logger = console;
    const isActive = true
    //const isActive = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
    this.status = isActive;
    this.debugEnabled = isActive;
  }

  log(message?: any, ...optionalParams: any[]): void {
    if (this.status) {
      this.logger.log(message, optionalParams);
    }
  }

  debug(message?: any, ...optionalParams: any[]): void {
    if (this.status && this.debugEnabled) {
      this.logger.debug(message, optionalParams);
    }
  }

  error(message?: any, ...optionalParams: any[]): void {
    if (this.status) {
      this.logger.error(message, optionalParams);
    }
  }

  info(message?: any, ...optionalParams: any[]): void {
    if (this.status) {
      this.logger.info(message, optionalParams);
    }
  }

  warn(message?: any, ...optionalParams: any[]): void {
    if (this.status) {
      this.logger.warn(message, optionalParams);
    }
  }

  enable(): void {
    this.status = true;
  }

  disable(): void {
    this.status = false;
  }

  enableDebug(): void {
    this.debugEnabled = true;
  }

  disableDebug(): void {
    this.debugEnabled = false;
  }
}
