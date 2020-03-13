import { Inject, Injectable, Optional } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Action, HttpError } from './http-error';
import { ErrorHandler, ErrorLogger, Handler } from './error-handler';
import { ErrorDialogService } from './error-dialog.service';
import { CUSTOM_ERROR_HANDLER, ERROR_LOGGER } from './token';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService implements ErrorHandler {

  constructor(
    private errorDialogService: ErrorDialogService,
    @Optional() @Inject(CUSTOM_ERROR_HANDLER) private customHandler: ErrorHandler,
    @Optional() @Inject(ERROR_LOGGER) private logger: ErrorLogger,
  ) {
  }

  handler(err: HttpErrorResponse, handler?: Handler) {
    let fn: Handler;
    let actions = [];
    if ( this.customHandler ) {
      fn = this.customHandler[ err.status ] || this.customHandler.defaultHandler;
    }
    if ( !fn ) {
      fn = handler || this[ err.status ] || this.defaultHandler as Handler;
      actions = [
        { label: 'OK' }
      ];
    }
    const error = fn.bind(this)(err);
    error.actions = [ ...actions, ...error.actions ];
    if ( this.logger ) {
      this.logger.log(error);
    }
    this.errorDialogService.open(error);
  }

  defaultHandler(err: HttpErrorResponse) {
    const error = new HttpError(err);
    error.title = `Application error`;
    const errorText = this.getErrorText(err);
    error.text = `The application experienced an unknown or unexpected exception. The exception is listed below:
    ${errorText}`;
    error.actions = [
      new Action('Refresh', () => window.location.reload())
    ];
    return error;
  }

  // Signature for error handlers
  [ code: number ]: Handler;

  0(err: HttpErrorResponse) {
    const error = new HttpError(err);
    error.title = 'No connection';
    const offline = !window.navigator.onLine;
    if ( offline ) {
      error.text = `You are not connected to the internet.`;
    } else {
      error.text = `We were unable to establish a connection to the server. There can be several reasons for this:

    - There was an intermittent connection loss
    - The request timed out`;
    }
    return error;
  }

  400(err: HttpErrorResponse) {
    const error = new HttpError(err);
    error.title = 'Errors in submitted form';
    const errorText = this.getErrorText(err);
    error.text = `The form contained invalid data.

    ${errorText}`;
    return error;
  }

  401(err: HttpErrorResponse) {
    const error = new HttpError(err);
    error.title = `Not signed in`;
    error.text = `You are not signed in or your session has expired. Please sign in and try again.`;
    error.actions = [];
    return error;
  }

  403(err: HttpErrorResponse) {
    const error = new HttpError(err);
    error.title = `Not authorized.`;
    error.text = `You do not have access to perform this action.
    Apply for the correct roles in Access IT.`;
    error.actions = [
      { label: 'ACCESS IT', action: () => window.open('https://accessit.equinor.com/', '_blank') }
    ];
    return error;
  }

  404(err: HttpErrorResponse) {
    const error = new HttpError(err);
    error.title = 'Item not found';
    const errorText = this.getErrorText(err);
    error.text = `The requested item / resource was not found.

    ${errorText}
    `;
    return error;
  }

  409(err: HttpErrorResponse) {
    const error = new HttpError(err);
    error.title = 'This resource has changed';
    const errorText = this.getErrorText(err);
    error.text = `This resource/item has been updated on the server. Please reload and try again.

    ${errorText}`;
    error.actions = [
      { label: 'Reload', action: () => window.location.reload() }
    ];
    return error;
  }

  500(err: HttpErrorResponse) {
    const error = new HttpError(err);
    error.title = `Unexpected error occurred`;
    const errorText = this.getErrorText(err);
    error.text = `We experienced an unknown exception. Please report this via Services @ Equinor

    ${errorText}`;
    error.actions = [
      { label: 'Services @ Equinor', action: () => window.open(`https://equinor.service-now.com`, '_blank') }
    ];
    return error;
  }

  501(err: HttpErrorResponse) {
    return this[ 500 ](err);
  }

  503(err: HttpErrorResponse) {
    return this[ 500 ](err);
  }

  getErrorText(err: HttpErrorResponse) {
    if ( this.customHandler && this.customHandler.getErrorText ) {
      return this.customHandler.getErrorText(err);
    }
    let errorText: string;
    try {
      const e = err.error instanceof Object ? err.error : JSON.parse(err.error);
      errorText = e.message;
    } catch ( ex ) {
      errorText = err.error;
    }
    return errorText;
  }

}
