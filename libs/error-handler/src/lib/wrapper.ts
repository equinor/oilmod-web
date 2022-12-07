import { Component, Injectable, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { CUSTOM_ERROR_HANDLER, ERROR_LOGGER, ErrorHandlerService, Handler, HttpError, StoErrorHandler } from '@ngx-stoui/error-handler';

@Component({
  selector: 'next-wrapper',
  template: `
    <button mat-button
            (click)="overRide(404)">Overridden 404
    </button>
    <button mat-button
            (click)="showError(s)"
            *ngFor="let s of errors">{{s}} {{ s === 401 ? '(App Override)' : ''}}</button>
  `,
  providers: []
})
export class NextWrapperComponent {
  public errors = [
    0,
    400,
    401,
    403,
    404,
    409,
    500,
    501,
    503
  ];

  constructor(private service: ErrorHandlerService) {
  }

  showError(status: number) {
    const err = new HttpErrorResponse({
      status,
      error: {
        message: 'server error message'
      },
      statusText: 'Error',
      url: 'http://errorhandler/api'
    });
    this.service.handler(err);
  }

  overRide(status: number) {
    const err = new HttpErrorResponse({
      status,
      error: {
        message: 'server error message'
      },
      statusText: 'Error',
      url: 'http://errorhandler/api'
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
  providedIn: 'root'
})
export class ErrorHandlerImpl implements StoErrorHandler {
  [ code: number ]: Handler;

  401(err: HttpErrorResponse) {
    const error = new HttpError(err);
    error.title = 'Custom not signed in';
    error.text = 'Custom not signed in text';
    return error;
  }
}

@Injectable({
  providedIn: 'root'
})
export class Logger {
  constructor(private http: HttpClient) {
  }

  log(err: HttpError) {
    // This method will typically go to the application backend or a central log repository
    console.log('Error', err);
  }
}

function LoggerFactory(http: HttpClient) {
  return new Logger(http);
}

@NgModule({
  declarations: [ NextWrapperComponent ],
  imports: [ CommonModule, MatButtonModule, HttpClientModule ],
  exports: [ NextWrapperComponent ],
  providers: [
    { provide: CUSTOM_ERROR_HANDLER, useClass: ErrorHandlerImpl },
    { provide: ERROR_LOGGER, useFactory: LoggerFactory, deps: [ HttpClient ] }
  ]
})
export class WrapperModule {
}

