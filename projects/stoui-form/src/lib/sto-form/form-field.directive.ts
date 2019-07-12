import {
  AfterContentInit,
  AfterViewInit,
  ContentChildren,
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
  Optional,
  QueryList
} from '@angular/core';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material';
import { StoUserPreferenceService } from '@ngx-stoui/core';
import { Subject } from 'rxjs';
import { filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';

@Directive({
  selector: 'mat-form-field[stoFormField]',
  exportAs: 'stoFormField'
})
export class FormFieldDirective implements AfterViewInit, AfterContentInit, OnDestroy {
  @ContentChildren(MatInput)
  input: QueryList<MatInput>;
  private destroyed$ = new Subject();

  constructor(
    private el: ElementRef<HTMLElement>
    , private host: MatFormField
    , @Optional() private userPreference: StoUserPreferenceService) {
  }

  ngAfterViewInit(): void {
    const el = this.el.nativeElement;
    el.classList.add('sto-form__field');
  }

  ngAfterContentInit() {
    this.input.changes
      .pipe(
        startWith(this.input),
        map((list: QueryList<MatInput>) => list.first),
        filter(el => !!el),
        switchMap(el => el.stateChanges.pipe(startWith(null))),
        takeUntil(this.destroyed$)
      )
      .subscribe(() => {
        const { readonly, disabled } = this.input.first;
        const el = this.el.nativeElement;
        el.classList.remove('sto-form__field--readonly', 'sto-form__field--disabled');
        if ( readonly ) {
          el.classList.add('sto-form__field--readonly');
        }
        if ( disabled ) {
          el.classList.add('sto-form__field--disabled');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  @HostListener('click')
  @HostListener('dblclick')
  onClick() {
    const el = this.input.first[ '_elementRef' ] as ElementRef<HTMLInputElement>;
    if ( el.nativeElement.readOnly || el.nativeElement.disabled ) {
      return;
    }
    let shouldSelect = true;
    if ( this.userPreference ) {
      shouldSelect = this.userPreference.preferences.hasSelectTextOnFocusEnabled;
    }
    if ( shouldSelect ) {
      el.nativeElement.focus();
      el.nativeElement.select();
    }
  }

}
