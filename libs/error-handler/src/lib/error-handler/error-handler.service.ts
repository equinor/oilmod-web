import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ErrorDialogService } from './error-dialog.service';
import { ErrorHandler, ErrorLogger, Handler } from './error-handler';
import { Action, HttpError } from './http-error';
import { CUSTOM_ERROR_HANDLER, ERROR_LOGGER } from './token';

@Injectable({
  providedIn: 'root',
})
/**
 * Service used to handle errors across our applications. Replaces the previous HttpErrorHandler
 */
export class ErrorHandlerService implements ErrorHandler {
  private errorDialogService = inject(ErrorDialogService);
  private customHandler = inject<ErrorHandler>(CUSTOM_ERROR_HANDLER, {
    optional: true,
  });
  private logger = inject<ErrorLogger>(ERROR_LOGGER, { optional: true });

  /**
   * Satisfies Angular global ErrorHandler interface
   * @param err
   */
  handleError(err: any): void {
    if (err instanceof HttpErrorResponse) {
      this.handler(err);
    } else {
      // Non HTTP errors are re-thrown.
      throw err;
    }
  }

  /**
   * Global handler. This method will try (in order): passed in handler -> custom handler -> default handler for code -> defaultHandler
   * All errors are passed to a dialog to be displayed there, and will by default have a simple "OK" button to close.
   * @param err
   * @param handler
   */
  handler(err: HttpErrorResponse, handler?: Handler) {
    let fn: Handler | undefined;
    let actions: Action[] = [];
    fn = handler;
    if (!fn && this.customHandler) {
      fn = this.customHandler[err.status] || this.customHandler.defaultHandler;
    }
    if (!fn) {
      fn = this[err.status] || (this.defaultHandler as Handler);
      actions = [{ label: 'OK' }];
    }
    // Ensure we bind the function to the correct context.
    const error = fn.bind(this)(err);
    // Add a default "OK" action, but only if the global handlers are used.
    // OK is also shown if no actions are passed in.
    error.actions = [...actions, ...error.actions];
    if (this.logger) {
      // Apply logger if available.
      this.logger.log(error);
    }
    this.errorDialogService.open(error);
  }

  // Fallback handler if unknown code
  defaultHandler(err: HttpErrorResponse) {
    const error = new HttpError(err);
    error.title = `Application error`;
    const errorText = this.getErrorText(err);
    error.text = `The application experienced an unknown or unexpected exception. The exception is listed below:
    ${errorText}`;
    error.actions = [new Action('Refresh', () => window.location.reload())];
    return error;
  }

  // Signature for error handlers
  [code: number]: Handler;

  0(err: HttpErrorResponse) {
    const error = new HttpError(err);
    error.title = 'No connection';
    const offline = !window.navigator.onLine;
    if (offline) {
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
      {
        label: 'ACCESS IT',
        action: () => window.open('https://accessit.equinor.com/', '_blank'),
      },
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
      { label: 'Reload', action: () => window.location.reload() },
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
      {
        label: 'Services @ Equinor',
        action: () => window.open(`https://equinor.service-now.com`, '_blank'),
      },
    ];
    return error;
  }

  501(err: HttpErrorResponse) {
    return this[500](err);
  }

  503(err: HttpErrorResponse) {
    return this[500](err);
  }

  /**
   * Uses the getErrorText from the provided custom handler, if available.
   * Otherwise, return the error message, if available in our desired format
   * Expected err.error -> { message | detail: 'A message', ... }
   * Also handles text as a fallback.
   * */
  getErrorText(err: HttpErrorResponse) {
    if (this.customHandler && this.customHandler.getErrorText) {
      return this.customHandler.getErrorText(err);
    }
    let errorText: string;
    try {
      const e = err.error instanceof Object ? err.error : JSON.parse(err.error);
      errorText = e.message || e.detail;
    } catch (ex) {
      errorText = typeof err.error === 'string' ? err.error : '';
    }
    return errorText;
  }
}
