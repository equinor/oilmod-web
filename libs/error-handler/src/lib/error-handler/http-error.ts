import { HttpErrorResponse } from '@angular/common/http';

/**
 * Internal HttpError format
 */
export class HttpError {
  // Status code
  status: number;
  // Dialog title
  title: string;
  // Dialog body
  text: string;
  // Action list.
  actions: Action[] = [];

  constructor(public readonly error: HttpErrorResponse) {
    this.status = error.status;
  }
}

/**
 * Available properties on dialog actions
 */
export class Action {
  /**
   * Button label
   */
  label: string;
  /**
   * A function to be called based on the given action (e.g window.location.reload to refresh the tab)
   */
  action?: (...args: any[]) => unknown;
  /**
   * The data to be returned when the dialog is closed.
   */
  closeDialogData?: Object;

  constructor(label: string);
  constructor(label: string, close: () => void);
  constructor(label: string, close: Object);
  constructor(label: string, close?: Object | (() => unknown)) {
    this.label = label;
    if ( typeof close === 'function' ) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.action = close;
    } else {
      this.closeDialogData = close;
    }
  }
}
