import { Component, NgModule } from '@angular/core';
import { HttpErrorHandlerService } from '../../projects/stoui-error-handler/src/lib/sto-http-error-handler/http-error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { APPLY_URL, APPNAME } from '../../projects/stoui-error-handler/src/lib/sto-http-error-handler/tokens';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material';

@Component({
  selector: 'wrapper',
  template: `
      <button mat-button
              (click)="showError(s)"
              *ngFor="let s of errors">{{s}}</button>
  `,
  providers: []
})
export class WrapperComponent {
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

  constructor(private httpErrorService: HttpErrorHandlerService) {
  }

  public showError(status: number) {
    const err = new HttpErrorResponse({
      status,
      error: {
        message: 'server error message'
      },
      statusText: 'Error',
      url: 'http://errorhandler/api'
    });
    this.httpErrorService.globalHandler(err);
  }
}

@NgModule({
  declarations: [ WrapperComponent ],
  imports: [ CommonModule, MatButtonModule ],
  exports: [ WrapperComponent ],
  providers: [
    { provide: APPNAME, useValue: 'TOPSWEB Storybook' },
    { provide: APPLY_URL, useValue: '#' },
  ]
})
export class WrapperModule {
}

