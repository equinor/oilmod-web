import { ContentChildren, Directive, HostListener, Input, OnDestroy, OnInit, QueryList } from '@angular/core';
import { MatDatepicker, MatInput } from '@angular/material';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

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
      ).subscribe(
      () => this.inputs.first.focus(),
      console.error,
      () => console.log('Destroyed'));
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
