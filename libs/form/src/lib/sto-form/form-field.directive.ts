/* tslint:disable:no-string-literal */
import {
  AfterContentInit,
  AfterViewInit,
  ContentChildren,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
  QueryList
} from '@angular/core';
import { MatFormFieldControl } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';

@Directive({
  selector: 'mat-form-field[stoFormField]',
  exportAs: 'stoFormField'
})
export class FormFieldDirective implements AfterViewInit, AfterContentInit, OnDestroy {
  @ContentChildren(MatFormFieldControl)
  input: QueryList<MatFormFieldControl<unknown>>;
  @HostBinding('title')
  title = '';
  private destroyed$ = new Subject();
  private titleSub: Subscription;

  constructor(
    private el: ElementRef<HTMLElement>) {
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
        const { disabled } = this.input.first;
        try {
          let name = this.input.first?.ngControl?.name;
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
        this.titleSub = this.input.first.stateChanges
          .pipe(
            debounceTime(30),
            startWith(0)
          )
          .subscribe(() => {
          if (this.input.first instanceof MatSelect) {
            this.title = this.input.first.triggerValue;
          } else {
            this.title = this.input.first.value as string || '';
          }
        })
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
