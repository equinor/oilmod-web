import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Key } from '../shared/abstract-and-interfaces/keyPress.enum';

@Directive({
  selector: '[quickKeys]'
})
export class QuickKeysDirective {
  @Input() quickKeys;
  @Input() formGroup: FormGroup;
  @Output() quickSubmit = new EventEmitter();
  @Output() quickCancel = new EventEmitter();

  @HostListener('keyup', ['$event'])
  onKeyUp(e: KeyboardEvent) {
    if (this.formGroup) {
      this.handleFormKeys(e);
    }
    this.handleGenericKeydown(e);
  }
  private handleGenericKeydown(e: KeyboardEvent) {
    // Shortcuts that are useful outside of forms
    if (e.keyCode === Key.Escape) {
      this.quickCancel.emit();
    }
    if (!this.formGroup && e.keyCode === Key.Enter && e.ctrlKey) {
      this.quickSubmit.emit();
    }
  }
  private handleFormKeys(e: KeyboardEvent) {
    if (this.formGroup.pristine) {
      return;
    }
    if (e.keyCode === Key.Enter && e.ctrlKey) {
      this.quickSubmit.emit();
    }
  }
}
