/* istanbul ignore file */
export class ConsoleLogger {
    private static readonly _logger: ConsoleLogger;
    private static readonly _console: Console = console;
    public static status: boolean;
    public static debugEnabled: boolean;

    private constructor() {
        const isActive = (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test');
        ConsoleLogger.status = isActive;
        ConsoleLogger.debugEnabled = isActive;
    }
    
    public static getInstance() : ConsoleLogger {
        if (!ConsoleLogger._logger) {
            return new ConsoleLogger();
        }
        return ConsoleLogger._logger;

    }

    log(message?: any, ...optionalParams: any[]): void {
        if (ConsoleLogger.status){
            ConsoleLogger._console.log(message, optionalParams);
        }
    }

    debug(message?: any, ...optionalParams: any[]): void {
        if (ConsoleLogger.status && ConsoleLogger.debugEnabled) {
           ConsoleLogger._console.debug(message, optionalParams);
        }
    }

    error(message?: any, ...optionalParams: any[]): void {
        if (ConsoleLogger.status){
            ConsoleLogger._console.error(message,optionalParams);
        }
    }

    info(message?: any, ...optionalParams: any[]): void {
        if (ConsoleLogger.status){
            ConsoleLogger._console.info(message, optionalParams);
        }
    }

    warn(message?: any, ...optionalParams: any[]): void {
        if (ConsoleLogger.status){
            ConsoleLogger._console.warn(message, optionalParams);
        }
    }

    enable(): void {
        ConsoleLogger.status = true;
    }

    disable(): void {
        ConsoleLogger.status = false;
    }

    enableDebug(): void {
        ConsoleLogger.debugEnabled = true;
    }

    disableDebug(): void {
        ConsoleLogger.debugEnabled = false;
    }

}
