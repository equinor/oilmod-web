import { HttpErrorResponse } from '@angular/common/http';
import { HttpError } from './http-error';

/**
 * Public interface for the error handler class.
 */
export interface StoErrorHandler {
  [ code: number ]: Handler;

  getErrorText?: (err: HttpErrorResponse) => string;
}

/**
 * Internal interface for our errorhandler.
 */
export interface ErrorHandler extends StoErrorHandler {
  handler: (err: HttpErrorResponse, handler?: Handler) => void;
  defaultHandler: Handler;
}

/**
 * Interface for the ErrorLogger injection token.
 */
export interface ErrorLogger {
  log: (HttpError) => void;
}

// Expected signature for error handlers.
export type Handler = (err: HttpErrorResponse) => HttpError;

