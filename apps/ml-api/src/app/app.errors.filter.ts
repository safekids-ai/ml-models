import {ExceptionFilter, Catch, HttpException, ArgumentsHost, HttpStatus, Logger} from '@nestjs/common';
import {CommonUtils} from './utils/commonUtils';
import {BaseError, ValidationError} from 'sequelize';
import {QueryException} from './error/common.exception';
import {Sequelize} from "sequelize-typescript";

@Catch()
export class ErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(ErrorFilter.name);

  private readonly stripeErrors = [
    'generate',
    'StripeError',
    'StripeCardError',
    'StripeInvalidRequestError',
    'StripeAPIError',
    'StripeAuthenticationError',
    'StripePermissionError',
    'StripeRateLimitError',
    'StripeConnectionError',
    'StripeSignatureVerificationError',
    'StripeIdempotencyError',
    'StripeInvalidGrantError',
  ];

  catch(error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Log the error message and stack trace
    this.logger.error("Original Error:", error);
    this.logger.error(this.getErrorInfoObject(error, status, ctx), error.stack, 'ErrorFilter');

    const responseObject = this.buildResponseObject(error);
    if (status === 500) {
      error.code = 500;
    }
    return response.status(error.code || status).send(responseObject);
  }

  buildResponseObject(error): string {
    let errorMessage = error.response && error.response.message ? error.response.message : error.message;
    if (error instanceof BaseError) {
      errorMessage = QueryException.error();
    }
    if (this.stripeErrors.includes(error.type)) {
      errorMessage = QueryException.stripeError();
    }
    return typeof errorMessage === 'string' ? JSON.stringify(errorMessage) : errorMessage;
  }

  getErrorInfoObject(error, status: number, hostContext): string {
    const errorObject: ErrorInfoObject = {
      message: error.code || status + ' - ' + error.message,
      status: error.code || status,
    };
    if (status.toString()[0] === '5') {
      const request = hostContext.getRequest();
      if (request) {
        errorObject.url = request.originalUrl;
        errorObject.body = CommonUtils.removeUnsafeFieldsFromObject(request.body);
        errorObject.params = request.params;
        errorObject.userId = request.user?._id;
      }
    }
    return JSON.stringify(errorObject, null, 4);
  }
}

interface ErrorInfoObject {
  message: string;
  url?: string;
  body?: { [key: string]: any };
  params?: { [key: string]: any };
  userId?: string;
  status: number;
}
