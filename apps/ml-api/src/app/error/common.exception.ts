import { HttpException, HttpStatus } from '@nestjs/common';

export class ValidationException extends HttpException {
    constructor(message: string, code?: number) {
        super(message, code ? code : HttpStatus.BAD_REQUEST);
    }
}

export class QueryException extends HttpException {
    constructor(message: string) {
        super(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    static update = (err = ''): string => {
        return `Could not perform update operation due to error: ${err}`;
    };

    static save = (err = ''): string => {
        return `Could not perform save operation due to error: ${err}`;
    };

    static fetch = (err = ''): string => {
        return `Could not perform fetch operation due to error: ${err}`;
    };

    static delete = (err = ''): string => {
        return `Could not perform delete operation due to error: ${err}`;
    };

    static upsert = (err = ''): string => {
        return `Could not perform upsert operation due to error: ${err}`;
    };

    static bulkCreate = (err = ''): string => {
        return `Could not save objects in bulk due to error: ${err}`;
    };

    static error = (): string => {
        return 'Could not perform database operation due to error';
    };

    static stripeError = (): string => {
        return 'An internal server error occurred. Please contact safe kids support';
    };
}
