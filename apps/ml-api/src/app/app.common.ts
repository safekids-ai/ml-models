export class AppError extends Error {
    private opts: any;

    constructor(message: string, opts?: any) {
        super(message);
        this.name = this.constructor.name;
        this.opts = opts;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = new Error(message).stack;
        }
    }
}
