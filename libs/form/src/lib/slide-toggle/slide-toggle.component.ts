/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  Self,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { FocusMonitor } from '@angular/cdk/a11y';
import { Subject, Subscription } from 'rxjs';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ThemePalette } from '@angular/material/core';
import { MatSlideToggle } from '@angular/material/slide-toggle';

export class StoSlideToggleChange {
  source: SlideToggleComponent;
  checked: boolean;
}

@Component({
  selector: 'sto-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrls: [ './slide-toggle.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    { provide: MatFormFieldControl, useExisting: SlideToggleComponent }
  ]
})
export class SlideToggleComponent implements OnInit, OnDestroy, ControlValueAccessor, MatFormFieldControl<boolean> {
  static nextId = 0;
  stateChanges = new Subject<void>();
  focused: boolean;
  autofilled: boolean;
  controlType = 'number-input';
  ctrl = new FormControl();
  public sub = new Subscription();
  @HostBinding()
  id = `value-unit-input-${SlideToggleComponent.nextId++}`;
  @HostBinding('attr.aria-describedby')
  describedBy = '';
  @ViewChild(MatSlideToggle)
  slideToggle: MatSlideToggle;
  @Output()
  toggled = new EventEmitter<StoSlideToggleChange>();

  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  get errorState() {
    return this._errorState;
  }

  set errorState(errorState) {
    this._errorState = errorState;
    this.stateChanges.next();
  }

  private _errorState: boolean;

  private _disabled = false;

  @Input()
  get disabled(): boolean {
    return this._disabled;
  }

  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    const opts = { onlySelf: true, emitEvent: false };
    this._disabled ? this.ctrl.disable(opts) : this.ctrl.enable(opts);
    this.stateChanges.next();
  }

  @Input()
  get color(): ThemePalette {
    return this._color || 'primary';
  }

  set color(color) {
    this._color = color || 'primary';
    this.stateChanges.next();
  }

  private _color: ThemePalette;

  private _readonly = false;

  @Input()
  get readonly(): boolean {
    return this._readonly;
  }

  set readonly(value: boolean) {
    this._readonly = coerceBooleanProperty(value);
    const opts = { onlySelf: true, emitEvent: false };
    value ? this.ctrl.disable(opts) : this.ctrl.enable(opts);
    this.stateChanges.next();
  }

  get empty() {
    const value = this.ctrl.value;
    return !( value && value !== 0 );
  }

  placeholder: string; // Required by material control, but not used.

  private _required = false;

  @Input()
  get required() {
    return this._required;
  }

  set required(req) {
    this._required = coerceBooleanProperty(req);
    this.stateChanges.next();
  }

  private _value: boolean | null;

  @Input()
  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
    this.ctrl.setValue(value, { emitEvent: false });
    this.stateChanges.next();
  }

  @Input()
  model: unknown;

  constructor(@Optional() @Self() public ngControl: NgControl,
              private fm: FocusMonitor,
              private elRef: ElementRef<HTMLElement>) {
    if ( this.ngControl != null ) {
      this.ngControl.valueAccessor = this;
    }
    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });
  }

  ngOnInit(): void {
    const sub = this.ctrl.valueChanges
      .subscribe((value: boolean) => {
        const event = new StoSlideToggleChange();
        event.checked = value;
        event.source = this;
        this.toggled.emit(event);
        this.onChange(value);
      });
    this.sub.add(sub);
    if ( this.ngControl && this.ngControl.statusChanges ) {
      this.sub.add(this.ngControl.statusChanges
        .subscribe(state => this.errorState = state === 'INVALID'));
    }
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
    this.sub.unsubscribe();
  }

  onContainerClick(event: MouseEvent): void {
    if ( !this.disabled && !this.readonly ) {
      this.slideToggle.focus();
      this.ctrl.setValue(!this.ctrl.value);
    }
  }

  setDescribedByIds(ids: string[]): void {
    this.describedBy = ids.join(' ');
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (_: unknown) => {
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {
  }

  writeValue(value: boolean): void {
    this.value = value;
  }

  registerOnChange(fn: never): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: never): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


}
