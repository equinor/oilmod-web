import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormattedError } from './format-error-message';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { ExceptionDialogComponent } from './unexcepted-dialog/exception-dialog.component';
import { ErrorFormatter } from './error-formatter';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Service that handles error messages. Can either open a dialog (with a returning action), or just a plain error
 * message to be displayed.
 * Extended documentation in {@link HttpErrorHandlerModule#readme}
 */
@Injectable()
export class HttpErrorHandlerService {
  private errorActionSubject: Subject<any> = new Subject();
  /**
   * errorAction$ emits a key telling the subscriber the action requested by the user
   * This is used e.g if we get a conflict (409), and the user wants to reload the latest version of an entity
   */
  public errorAction$: Observable<any> = this.errorActionSubject.asObservable();

  private errorMessageSubject = new ReplaySubject<FormattedError>();
  public errorMessage$: Observable<FormattedError> = this.errorMessageSubject.asObservable();

  /**
   * Exposed method that takes in a {@link FormattedError} and handles it according to design specs.
   * Will either emit a message to any subscribers listening for messages, or open a dialog.
   * Dialogs are primarily for critical errors, or errors requiring user action.
   * @param err
   */
  public errorHandler(err: FormattedError) {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 10);
    if ( !err ) {
      this.errorMessageSubject.next(null);
      return;
    }
    switch ( err.status ) {
      case 404:
      case 400:
        this.errorMessageSubject.next(err);
        break;
      default:
        this.handleModalError(err);
        break;
    }
  }

  /**
   * Takes in a {FormattedError}, and opens a dialog with {ExceptionDialogComponent}.
   * Sends out information about the action (if any) was performed by the user in the dialog
   * @param data
   */
  public handleModalError(data: FormattedError) {
    const dialog = this.dialog.open(ExceptionDialogComponent, {
      width: '600px',
      panelClass: 'sto-dialog',
      data
    });
    dialog
      .afterClosed()
      .subscribe(action => {
        this.errorActionSubject.next(action);
      });
  }

  public globalHandler(error: HttpErrorResponse) {
    const err = this.errorFormatter.format(error);
    const dialog = this.dialog.open(ExceptionDialogComponent, {
      width: '600px',
      panelClass: 'sto-dialog',
      data: err
    });
    this.dialogHandler(dialog);
  }

  public async dialogHandler(dialog: MatDialogRef<ExceptionDialogComponent>) {
    const action = await dialog.afterClosed().toPromise();
    if ( action === 'replace' ) {
      window.location.reload();
    }
  }

  constructor(private dialog: MatDialog, private errorFormatter: ErrorFormatter) {
  }

}
