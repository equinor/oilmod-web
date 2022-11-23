import { ContentChildren, Directive, HostListener, Input, OnDestroy, OnInit, QueryList } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatLegacyInput as MatInput } from '@angular/material/legacy-input';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Directive that can be placed on mat-form-fields that contains a mat-datepicker.
 * This directive has two tasks:
 * Clicking anywhere on the mat-form-field will open the datepicker dialog
 * When the datepicker is closed in any manner, we shift focus back to the datepicker input
 */
@Directive({
  selector: '[stoDateFormFieldClick]',
  standalone: true
})
export class DateFormFieldClickDirective implements OnInit, OnDestroy {
  @ContentChildren(MatInput) inputs: QueryList<MatInput>;
  @Input() stoDateFormFieldClick: MatDatepicker<Date>;
  private destroy$ = new Subject();

  @HostListener('click')
  clickEvent() {
    this.stoDateFormFieldClick.open();
  }

  ngOnInit() {
    this.stoDateFormFieldClick.closedStream
      .pipe(
        takeUntil(this.destroy$)
      ).subscribe(() => this.inputs.first.focus());
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
