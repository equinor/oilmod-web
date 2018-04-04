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

  canDeactivate(component: any) {
    const unsavedChangesComponent = component.unsavedChild || component;
    if (!unsavedChangesComponent.form || unsavedChangesComponent.ignoreUnsavedChanges) {
      return true;
    }
    if (!unsavedChangesComponent.form.dirty) {

      return Observable.create((observer: Observer<boolean>) => {
        this.close(unsavedChangesComponent, observer);
      });

    } else {
      return Observable.create((observer: Observer<boolean>) => {
        this.showChangesDialog(unsavedChangesComponent, observer);
      });
    }
  }

  private close(component: UnsavedChanges, observer: Observer<boolean>) {
    observer.next(true);
    observer.complete();
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