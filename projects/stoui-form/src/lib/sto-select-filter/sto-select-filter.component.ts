import {
  Component,
  OnInit,
  forwardRef,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  HostBinding,
  ViewEncapsulation
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

/**
 * Component used in mat-select's to filter out the values, and adds a Select all checkbox
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
  styleUrls: ['./sto-select-filter.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StoSelectFilterComponent),
      multi: true
    }
  ]
})
export class StoSelectFilterComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @HostBinding('class.sto-select-filter') cssClass: boolean = true;

  public checkboxControl = new FormControl();
  public inputControl = new FormControl();

  public indeterminate: boolean;

  private _value: any;
  /**
   * Initial value of the filter
   */
  @Input() set value(value: any) {
    this._value = value;
    this.writeValue(value);
  }

  get value(): any {
    return this._value;
  };


  private _total: number;
  /**
   * Length of unfiltered Array
   * @param total
   */
  @Input() set total(total: number) {
    this._total = total;
  }

  get total(): number {
    return this._total;
  };


  private _selected: number;
  /**
   * Determines the checkbox state. Can be checked, indeterminate or unchecked
   * @param selected
   */
  @Input() set selected(selected: number) {
    if (this.total === selected) {
      this.isChecked(true);
      this.indeterminate = false;
    } else if (selected > 0) {
      this.indeterminate = true;
      this.isChecked(false);
    }
    else {
      this.indeterminate = false;
      this.isChecked(false);
    }
    this._selected = selected;
  }

  get selected(): number {
    return this._selected;
  };


  public isChecked(isChecked: boolean) {
    ;
    this.checkboxControl.setValue(isChecked, {emitEvent: false});
  }

  /**
   * Emits when selectAll checkbox changes
   */
  @Output() selectAll = new EventEmitter<boolean>();
  /**
   * Emits when the search value changes
   */
  @Output() valueChanges = new EventEmitter<boolean>();

  /**
   * isMulti determines if select all is available
   */
  @Input() isMulti: boolean;
  /**
   * isFilter determines if filtering is active
   */
  @Input() isFilter: boolean;
  private destroyed$ = new Subject();

  writeValue(value: any) {
    if (value || value === '') {
      this.inputControl.setValue(value);
    }
  }

  propagateChange = (value: any) => {
    this.valueChanges.emit(value);
  };

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }


  constructor() {
  }

  ngOnDestroy() {

    this.destroyed$.next(true);
    this.destroyed$.complete();
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
      ).subscribe(value => this.propagateChange(value));
  }

}
