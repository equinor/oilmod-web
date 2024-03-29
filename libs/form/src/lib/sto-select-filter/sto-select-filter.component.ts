import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, UntypedFormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatLegacySelect as MatSelect } from '@angular/material/legacy-select';

/**
 * Component used in mat-select's to filter out the values, and adds a Select all checkbox
 * @deprecated will be removed in v14 or v15, use {@link StoOptionSelectAllComponent}
 *
 * @example
 *
 * public all = ["a", "b", "c"];
 * public filtered = [];
 * public selectAll(checked: boolean) {
 *  this.control.setValue(checked ? all : []);
 * }
 * public filter(val: string) {
 *    this.filtered = all.filter(x => x === val);
 * }
 * <mat-select [formControl]="control">
 *   <sto-select-filter (valueChanges)="filter($event)" (selectAll)="selectAll($event)"></sto-select-filter>
 *   <mat-option *ngFor="let v of filtered">{{ v }}</mat-option>
 * </mat-select>
 */

@Component({
  selector: 'sto-select-filter',
  templateUrl: './sto-select-filter.component.html',
  styleUrls: [ './sto-select-filter.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StoSelectFilterComponent),
      multi: true
    }
  ]
})
export class StoSelectFilterComponent implements OnInit, AfterViewInit, OnDestroy, ControlValueAccessor {

  @HostBinding('class.sto-select-filter') cssClass = true;
  @ViewChild('inputElement')
  public inputElement: ElementRef<HTMLInputElement>;
  public checkboxControl = new UntypedFormControl();
  public inputControl = new UntypedFormControl();
  public indeterminate: boolean;
  /**
   * Emits when selectAll checkbox changes
   */
  @Output() selectAll = new EventEmitter<boolean>();
  /**
   * Emits when the search value changes
   */
  @Output() valueChanges = new EventEmitter<unknown>();
  /**
   * isMulti determines if select all is available
   */
  @Input() isMulti: boolean;
  /**
   * isFilter determines if filtering is active
   */
  @Input() isFilter: boolean;
  /**
   * automatically focus input element if it's empty
   */
  @Input() focusIfNoValue: boolean;
  private destroyed$ = new Subject();

  constructor(public select: MatSelect) {
  }

  private _value: unknown;

  get value(): unknown {
    return this._value;
  }

  /**
   * Initial value of the filter
   */
  @Input() set value(value: unknown) {
    this._value = value;
    this.writeValue(value);
  }

  private _total: number;

  get total(): number {
    return this._total;
  }

  /**
   * Length of unfiltered Array
   * @param total
   */
  @Input() set total(total: number) {
    this._total = total;
  }

  private _selected: number;

  get selected(): number {
    return this._selected;
  }

  /**
   * Determines the checkbox state. Can be checked, indeterminate or unchecked
   * @param selected
   */
  @Input() set selected(selected: number) {
    if ( this.total === selected ) {
      this.isChecked(true);
      this.indeterminate = false;
    } else if ( selected > 0 ) {
      this.indeterminate = true;
      this.isChecked(false);
    } else {
      this.indeterminate = false;
      this.isChecked(false);
    }
    this._selected = selected;
  }

  public isChecked(isChecked: boolean) {

    this.checkboxControl.setValue(isChecked, { emitEvent: false });
  }

  writeValue(value: unknown) {
    if ( value || value === '' ) {
      this.inputControl.setValue(value);
    }
  }

  propagateChange = (value: unknown) => {
    this.valueChanges.emit(value);
  };

  registerOnChange(fn: never): void {
    this.propagateChange = fn;
  }

  // eslint-disable-next-line
  registerOnTouched(fn: unknown): void {
  }

  ngOnDestroy() {

    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  ngAfterViewInit(): void {
    if ( this.select ) {
      this.select.openedChange.pipe(takeUntil(this.destroyed$)).subscribe(open => {
        if ( open && this.focusIfNoValue && this.isMulti ) {
          this.inputElement?.nativeElement.focus();
        }
      });
    }
  }

  ngOnInit() {
    this.checkboxControl.valueChanges
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(isChecked => {
      this.selectAll.emit(isChecked);
    });

    this.inputControl.valueChanges
      .pipe(
        takeUntil(this.destroyed$)
      ).subscribe(value => {
      if ( !value && this.focusIfNoValue ) {
        requestAnimationFrame(() => this.inputElement.nativeElement.focus());
      }
      this.propagateChange(value);
    });
  }
}
