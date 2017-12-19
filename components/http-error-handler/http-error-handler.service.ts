import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { FormattedError } from './format-error-message';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ExceptionDialogComponent } from './unexcepted-dialog/exception-dialog.component';
import { ReplaySubject } from 'rxjs/ReplaySubject';

@Injectable()
export class HttpErrorHandlerService {
  private errorActionSubject: Subject<any> = new Subject();
  public errorAction$: Observable<any> = this.errorActionSubject.asObservable();

  private errorMessageSubject = new ReplaySubject<FormattedError>();
  public errorMessage$: Observable<FormattedError> = this.errorMessageSubject.asObservable();

  public errorHandler(err: FormattedError) {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 10);
    if (!err) {
      this.errorMessageSubject.next(null);
      return;
    }
    switch (err.status) {
      case 500:
      case 409:
        this.handleModalError(err);
        break;
      case 404:
      case 400:
        this.errorMessageSubject.next(err);
        break;
      default:
        this.handleModalError(err);
        break;
    }
  }

  private handleModalError(data: FormattedError) {
    const dialog = this.dialog.open(ExceptionDialogComponent, {
      width: '600px',
      data
    });
    dialog
      .afterClosed()
      .subscribe(action => {
        this.errorActionSubject.next(action);
      });
  }

  constructor(private dialog: MatDialog) {
  }

}
