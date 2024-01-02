
export type ILogger = {
    status: boolean

    log: (string: string) => void
    error: (reason: string | Error) => void
    enable: () => void
    disable: () => void
    enableDebug:() => void
    disableDebug:() => void
    debug:(string: string) => void
}

export class Logger implements ILogger {
    private readonly logger: Console
    public status: boolean
    public debugEnabled : boolean

    constructor () {
        this.logger = console
        this.status = process.env.NODE_ENV === 'development'
        this.debugEnabled = process.env.NODE_ENV === 'development'
    }

    log (string: string): void {
        this.logger.log('[SafeKids] '+string)
    }

    debug (string: string): void {
        if (this.status && this.debugEnabled) this.logger.log('[SafeKids][DEBUG] '+string)
    }

    error (reason: string | Error): void {
        if (this.status) this.logger.error(reason)
    }

    enable (): void {
        this.status = true
    }

    disable (): void {
        this.status = false
    }

    enableDebug (): void {
        this.debugEnabled = true
    }

    disableDebug (): void {
        this.debugEnabled = false
    }
}
