import { CommonModule } from '@angular/common';
import {
  HttpClient,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { Component, Injectable, NgModule, inject } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Handler, StoErrorHandler } from './error-handler/error-handler';
import {
  CUSTOM_ERROR_HANDLER,
  ERROR_LOGGER,
  ErrorHandlerService,
  HttpError,
} from './error-handler/error-handler.service';

@Component({
  selector: 'next-wrapper',
  template: `
    <button mat-button (click)="overRide(404)">Overridden 404</button>
    @for (s of errors; track s) {
      <button mat-button (click)="showError(s)">
        {{ s }} {{ s === 401 ? '(App Override)' : '' }}
      </button>
    }
  `,
  providers: [],
  imports: [MatButton],
})
export class NextWrapperComponent {
  private service = inject(ErrorHandlerService);

  public errors = [0, 400, 401, 403, 404, 409, 500, 501, 503];

  showError(status: number) {
    const err = new HttpErrorResponse({
      status,
      error: {
        message: 'server error message',
      },
      statusText: 'Error',
      url: 'http://errorhandler/api',
    });
    this.service.handler(err);
  }

  overRide(status: number) {
    const err = new HttpErrorResponse({
      status,
      error: {
        message: 'server error message',
      },
      statusText: 'Error',
      url: 'http://errorhandler/api',
    });
    const handler = function (err: HttpErrorResponse) {
      const e = new HttpError(err);
      e.title = 'Local override 404';
      e.text = 'Local override not found item';
      return e;
    };
    this.service.handler(err, handler);
  }
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerImpl implements StoErrorHandler {
  [code: number]: Handler;

  401(err: HttpErrorResponse) {
    const error = new HttpError(err);
    error.title = 'Custom not signed in';
    error.text = 'Custom not signed in text';
    return error;
  }
}

@Injectable({
  providedIn: 'root',
})
export class Logger {
  private http = inject(HttpClient);

  log(err: HttpError) {
    // This method will typically go to the application backend or a central log repository
    console.log('Error', err);
  }
}

@NgModule({
  exports: [NextWrapperComponent],
  imports: [CommonModule, MatButtonModule, NextWrapperComponent],
  providers: [
    { provide: CUSTOM_ERROR_HANDLER, useClass: ErrorHandlerImpl },
    { provide: ERROR_LOGGER, useClass: Logger, deps: [HttpClient] },
    provideHttpClient(withInterceptorsFromDi()),
  ],
})
export class WrapperModule {}
