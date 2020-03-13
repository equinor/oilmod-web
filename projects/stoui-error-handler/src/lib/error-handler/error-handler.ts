import { HttpErrorResponse } from '@angular/common/http';
import { HttpError } from './http-error';


export interface StoErrorHandler {
  [ code: number ]: Handler;
}

export interface ErrorHandler extends StoErrorHandler {
  handler?: (err: HttpErrorResponse, handler?: Handler) => void;
  defaultHandler: Handler;
  getErrorText?: (err: HttpErrorResponse) => string;
}

export interface ErrorLogger {
  log: (HttpError) => void;
}

export type Handler = (err: HttpErrorResponse) => HttpError;
