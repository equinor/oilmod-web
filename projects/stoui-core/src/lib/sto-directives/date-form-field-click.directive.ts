import { ContentChildren, Directive, HostListener, Input, OnDestroy, OnInit, QueryList } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

/**
 * Directive that can be placed on mat-form-fields that contains a mat-datepicker.
 * This directive has two tasks:
 * Clicking anywhere on the mat-form-field will open the datepicker dialog
 * When the datepicker is closed in any manner, we shift focus back to the datepicker input
 */
@Directive({
  selector: '[stoDateFormFieldClick]'
})
export class DateFormFieldClickDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject();
  @ContentChildren(MatInput) inputs: QueryList<MatInput>;
  @Input() stoDateFormFieldClick: MatDatepicker<Date>;
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
