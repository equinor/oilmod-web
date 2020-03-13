import { HttpErrorResponse } from '@angular/common/http';

export class HttpError {
  status: number;
  title: string;
  text: string;
  actions: Action[];

  constructor(public readonly error: HttpErrorResponse) {
    this.status = error.status;
    this.actions = [];
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
  action?: Function;
  /**
   * The data to be returned when the dialog is closed.
   */
  closeDialogData?: Object;

  constructor(label: string);
  constructor(label: string, close: () => void);
  constructor(label: string, close: Object);
  constructor(label: string, close?) {
    this.label = label;
    if ( typeof close === 'function' ) {
      this.action = close;
    } else {
      this.closeDialogData = close;
    }
  }
}
