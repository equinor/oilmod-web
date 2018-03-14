import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { UnsavedChanges } from './unsaved-changes.interface';


@Injectable()
export class UnsavedChangesGuard implements CanDeactivate<UnsavedChanges> {

  private _dialogConfig = new MatDialogConfig();

  private _animationSpeedDrawer = 500;

  constructor(private dialog: MatDialog) {
    this._dialogConfig.width = '420px';
    this._dialogConfig.hasBackdrop = true;
  }

  canDeactivate(component: UnsavedChanges) {
    if(!component.form || component.ignoreUnsavedChanges){
      return true;
    }
    if (!component.form.dirty) {

      return Observable.create((observer: Observer<boolean>) => {
        this.close(component, observer);
      });

    } else {
      return Observable.create((observer: Observer<boolean>) => {
        this.showChangesDialog(component, observer);
      });
    }
  }

  private close(component: UnsavedChanges, observer: Observer<boolean>) {
    if(component.drawer){
      component.drawer.closeDrawer();
      setTimeout(() => {
        observer.next(true);
        observer.complete();
      }, this._animationSpeedDrawer);
    } else {
      observer.next(true);
      observer.complete();
    }
  }

  private showChangesDialog(component: UnsavedChanges, observer: Observer<boolean>) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, this._dialogConfig);
    dialogRef
      .afterClosed()
      .subscribe(disregardChanges => {
        if (disregardChanges) {
          this.close(component, observer);
        } else {
          this.cancelNavigation(observer);
        }
      });
  }

  private cancelNavigation(observer: Observer<boolean>) {
    observer.next(false);
    observer.complete();
  }
}
