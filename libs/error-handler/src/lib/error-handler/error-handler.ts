import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler as AngularErrorHandler } from '@angular/core';
import { HttpError } from './http-error';

/**
 * Public interface for the error handler class.
 */
export interface StoErrorHandler {
  [code: number]: Handler;

  getErrorText?: (err: HttpErrorResponse) => string;
}

/**
 * Internal interface for our errorhandler.
 */
export interface ErrorHandler extends StoErrorHandler, AngularErrorHandler {
  handler: (err: HttpErrorResponse, handler?: Handler) => void;
  handleError: (err: any) => void;
  defaultHandler: Handler;
}

/**
 * Interface for the ErrorLogger injection token.
 */
export interface ErrorLogger {
  log: (arg0: HttpError) => void;
}

// Expected signature for error handlers.
export type Handler = (err: HttpErrorResponse) => HttpError;
