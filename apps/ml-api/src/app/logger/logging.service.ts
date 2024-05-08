import { Inject, Injectable, Scope } from '@nestjs/common';
import { Logger } from 'winston';

@Injectable()
export class LoggingService {
    private readonly logger: Logger;
    private context: string;

    constructor(@Inject('winston') protected readonly _logger: Logger) {
        this.logger = _logger;
    }

    className = (className: string) => {
        this.context = className;
    };

    getContext = () => {
        return { context: this.context };
    };

    debug = (message: string, params?: any) => {
        const metaWithContext = { params, ...this.getContext() };
        this.logger.debug(message, metaWithContext);
    };

    info = (message: string, params?: any) => {
        const metaWithContext = { params, ...this.getContext() };
        this.logger.info(message, metaWithContext);
    };

    warn = (message: string, params?: any) => {
        const metaWithContext = { params, ...this.getContext() };
        this.logger.warn(message, metaWithContext);
    };

    error = (message: string, params?: any) => {
        const metaWithContext = { params, ...this.getContext() };
        this.logger.error(message, metaWithContext);
    };
}
