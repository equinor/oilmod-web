/* tslint:disable:no-string-literal */
import { AfterContentInit, AfterViewInit, ContentChildren, Directive, ElementRef, HostBinding, HostListener, Input, OnDestroy, QueryList, inject } from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { NgControl } from '@angular/forms';
import { HIDE_FORM_FIELD_TITLE } from './token';
import { DateRange, MatDateRangeInput } from '@angular/material/datepicker';

@Directive({
  selector: 'mat-form-field[stoFormField]',
  exportAs: 'stoFormField',
  standalone: true
})
export class FormFieldDirective implements AfterViewInit, AfterContentInit, OnDestroy {
  private hideFormFieldTitle = inject(HIDE_FORM_FIELD_TITLE, { optional: true });
  private el = inject<ElementRef<HTMLElement>>(ElementRef);

  @ContentChildren(MatFormFieldControl)
  input: QueryList<MatFormFieldControl<unknown>>;
  @Input()
  disableFormFieldTitle: boolean;
  @HostBinding('title')
  title = '';
  private destroyed$ = new Subject();
  private titleSub: Subscription;

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
        const { disabled } = this.input.first;
        try {
          let name = ( this.input.first?.ngControl as NgControl )?.name;
          // Fallback to using the name-attribute
          if ( !name && 'name' in this.input.first ) {
            name = ( this.input.first as MatInput ).name;
          }
          if ( name ) {
            this.el.nativeElement.setAttribute('data-cy', `${name}`);
          }
        } catch {/*em all*/
        }
        // eslint-disable-next-line
        if ( this.titleSub ) {
          this.titleSub.unsubscribe();
        }
        if ( !this.hideFormFieldTitle && !this.disableFormFieldTitle ) {
          this.titleSub = this.input.first.stateChanges
            .pipe(
              debounceTime(30),
              startWith(0),
              takeUntil(this.destroyed$)
            )
            .subscribe(() => {
              if ( this.input.first instanceof MatSelect ) {
                this.title = this.input.first.triggerValue;
              } else if ( this.input.first instanceof MatDateRangeInput ) {
                const value = this.input.first.value as DateRange<Date>;
                if ( !value ) {
                  this.title = '';
                  return;
                }
                this.title = Object.values(value)
                  .filter(v => !!v)
                  .map(value => {
                    if ( value instanceof Date ) {
                      const year = value.getFullYear();
                      const month = `${value.getMonth() + 1}`.padStart(2, '0');
                      const day = `${value.getDate()}`.padStart(2, '0');
                      return `${year}-${month}-${day}`;
                    }
                    return value;
                  })
                  .join(' - ');
              } else {
                const value = this.input.first.value;
                if ( typeof value === 'string' ) {
                  this.title = value || '';
                } else if ( Array.isArray(value) ) {
                  this.title = value.join(', ');
                } else if ( value instanceof Date ) {
                  const year = value.getFullYear();
                  const month = `${value.getMonth() + 1}`.padStart(2, '0');
                  const day = `${value.getDate()}`.padStart(2, '0');
                  this.title = `${year}-${month}-${day}`;
                }
              }
            });
        }
        let readOnly = ( this.input.first as any ).readonly || false;
        if ( this.input.first instanceof MatInput ) {
          readOnly = this.input.first.readonly;
        }

        const el = this.el.nativeElement;
        el.classList.remove('sto-form__field--readonly', 'sto-form__field--disabled');
        if ( readOnly ) {
          el.classList.add('sto-form__field--readonly');
        }
        if ( disabled ) {
          el.classList.add('sto-form__field--disabled');
        }
        if ( this.input.first instanceof MatInput ) {
          const inputEl = this.input.first[ '_elementRef' ] as ElementRef<HTMLInputElement>;
          inputEl.nativeElement.autocomplete = 'off';
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
    if ( !( this.input.first instanceof MatInput ) ) {
      return;
    }
    const el = this.input.first[ '_elementRef' ] as ElementRef<HTMLInputElement>;
    if ( el.nativeElement.readOnly || el.nativeElement.disabled ) {
      return;
    }
    const shouldSelect = true;
    const textarea = el.nativeElement.tagName.toLowerCase() === 'textarea';
    if ( shouldSelect && !textarea ) {
      el.nativeElement.focus();
      el.nativeElement.select();
    }
  }

}
