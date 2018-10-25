import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Key } from '../shared/abstract-and-interfaces/keyPress.enum';

/**
 * QuickKeysDirective is used to implement shortcut keys on DOM elements, e.g to submit or reset a form on enter/escape
 * <form quickKeys (quickSubmit)="save()" (quickCancel)="reset()">
 */

@Directive({
  selector: '[quickKeys]'
})
export class QuickKeysDirective {
  @Input() quickKeys;
  /**
   * Optional formGroup input, when used in combination with a reactive form
   */
  @Input() formGroup: FormGroup;
  /**
   * Emits when ctrl + enter is clicked in combination
   * <form (quickSubmit)="save()">
   */
  @Output() quickSubmit = new EventEmitter<void>();
  /**
   * Emits when escape is clicked
   * <form (quickCancel)="cancel()">
   */
  @Output() quickCancel = new EventEmitter<void>();

  /**
   * Listens on the host element for any keyup events
   * @param e
   */
  @HostListener('keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    if (this.formGroup) {
      this.handleFormKeys(e);
    }
    this.handleGenericKeydown(e);
  }

  /**
   * Handler for generic keydowns, such as cancel events to close drawers
   * @param e
   * void
   */
  private handleGenericKeydown(e: KeyboardEvent) {
    // Shortcuts that are useful outside of forms
    if (e.keyCode === Key.Escape) {
      this.quickCancel.emit();
    }
    if (!this.formGroup && e.keyCode === Key.Enter && e.ctrlKey) {
      this.quickSubmit.emit();
    }
  }

  /**
   * Handler for form specific shortcuts, such as saving the form
   * @param e
   */
  private handleFormKeys(e: KeyboardEvent) {
    if (this.formGroup.pristine) {
      return;
    }
    if (e.keyCode === Key.Enter && e.ctrlKey) {
      this.quickSubmit.emit();
    }
  }
}
