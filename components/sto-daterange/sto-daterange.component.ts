import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  ViewChild, ViewEncapsulation
} from '@angular/core';
import {
  ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR,
  Validators
} from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import {
  addMonths,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
  isAfter,
  isFirstDayOfMonth,
  isLastDayOfMonth,
  isThisMonth,
  isSameDay, isValid, parse
} from 'date-fns';
import { debounceTime, map, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'sto-daterange',
  templateUrl: './sto-daterange.component.html',
  styleUrls: ['./sto-daterange.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StoDaterangeComponent),
      multi: true
    }
  ],
  animations: [
    trigger('overlayState', [
      state('hidden', style({
        opacity: 0
      })),
      state('visible', style({
        opacity: 1
      })),
      transition('visible => hidden', animate('400ms ease-in')),
      transition('hidden => visible', animate('400ms ease-out'))
    ])
  ]
})
export class StoDaterangeComponent implements ControlValueAccessor, OnInit, AfterViewInit, OnDestroy {

  public log = console.log;
  private destroy$ = new Subject();
  @Input() showIcon: boolean = true;
  @Input() icon: string = 'fa-calendar';
  @Input() styleClass: string[];
  @Input() style: string[];
  @Input() inputStyle: string[];
  @Input() inputStyleClass: string[];
  @Input() appendTo: string;

  @Input() placeholder: string;
  @Input() inputId: string;
  @Input() required: boolean;
  @Input() disabled: boolean;

  @Input() monthNavigator: boolean;
  @Input() yearNavigator: boolean;

  @Output() onFocus: EventEmitter<any> = new EventEmitter();
  @Output() onBlur: EventEmitter<any> = new EventEmitter();

  @ViewChild('datepicker') overlayViewChild: ElementRef;
  @ViewChild('inputfield') inputfield: ElementRef;
  private initValues;

  public form: FormGroup;
  public fromControl = new FormControl();
  public toControl = new FormControl();

  public dateClick: boolean;
  public overlay: HTMLDivElement;
  public closeOverlay: boolean;
  public focus: boolean;
  public overlayVisible: boolean;
  public overlayShown: boolean;
  public value: any;
  public inputFieldValue: string = '';
  public error: Observable<string>;
  public selectValue = 'Custom';
  public selected: number = 4;

  private documentClickListener: any;
  @HostListener('document:keydown.escape ') onEscape() {
    if (this.overlayVisible) {
      this.onCancel();
    }
  }

  public showOverlay(inputfield?) {
    this.overlayVisible = true;
    this.overlayShown = true;
    this.bindDocumentClickListener();
  }

  public onCancel() {
    this.overlayVisible = false;
    this.closeOverlay = true;
    this.form.setValue(this.initValues, {emitEvent: false});
    this.inputfield.nativeElement.focus();
  }

  public onSubmit() {
    this.overlayVisible = false;
    this.closeOverlay = true;
    let {start, end} = this.form.value;
    if (start && end) {
      this.updateInputfield(this.form.value);
      this.propagateChange(this.form.value);
    }
  }

  public tenWeeks() {
    const values = {
      start: subWeeks(new Date(), 2),
      end: addWeeks(new Date(), 8)
    };
    this.form.setValue(values);
    this.selectValue = '-2 Weeks - +8 Weeks';
    this.selected = 0;
  }

  public periodPicker(unit: 'week' | 'month', when: string): void {
    const week = unit === 'week';
    const addFn = unit === 'week' ? addWeeks : addMonths;
    const subFn = unit === 'week' ? subWeeks : subMonths;
    const startFn = unit === 'week' ? startOfWeek : startOfMonth;
    const endFn = unit === 'week' ? endOfWeek : endOfMonth;
    switch (when) {
      case '-':
        this.form.setValue({
          start: week ? startOfWeek(subFn(new Date(), 1), {weekStartsOn: 1}) : startOfMonth(subFn(new Date(), 1)),
          end: week ? endOfWeek(subFn(new Date(), 1), {weekStartsOn: 1}) : endOfMonth(subFn(new Date(), 1))
        }, { emitEvent : false        });
        this.selectValue = `Previous ${unit}`;
        this.selected = 1;
        break;
      case '+':
        this.form.setValue({
          start: week ? startOfWeek(addFn(new Date(), 1), {weekStartsOn: 1}) : startOfMonth(addFn(new Date(), 1)),
          end: week ? endOfWeek(addFn(new Date(), 1), {weekStartsOn: 1}) : endOfMonth(addFn(new Date(), 1))
        });
        this.selectValue = `Next ${unit}`;
        this.selected = 3;
        break;
      default:
        this.form.setValue({
          start: week ? startOfWeek(new Date(), {weekStartsOn: 1}) : startOfMonth(new Date()),
          end: week ? endOfWeek(new Date(), {weekStartsOn: 1}) : endOfMonth(new Date())
        });
        this.selectValue = `This ${unit}`;
        this.selected = 2;
        break;
    }
  }

  /**
   * This function creates a perf hit, as it triggers a global DOM listener for all click events
   */
  public bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = this.renderer.listen('document', 'click', (event) => {

        // Don't close if inside the date range picker
        for (const el of event.path) {
          if (el.localName === 'sto-calendar' ||
            el.localName === 'sto-daterange' ||
            el.localName === 'mat-option' ||
              el.className === 'cdk-overlay-container'
          ) {
            this.closeOverlay = false;
            break;
          }
        }

        if (this.closeOverlay) {
          this.overlayVisible = false;
        }

        this.closeOverlay = true;
        this.dateClick = false;
        this.cd.detectChanges();
      });
    }
  }

  onInputFocus(inputfield, event) {
    this.focus = true;
    this.showOverlay(inputfield);
    this.onFocus.emit(event);
  }

  onButtonClick(event, inputfield) {
    this.closeOverlay = false;

    if (!this.overlay.offsetParent) {
      inputfield.focus();
      this.showOverlay(inputfield);
    }
    else {
      this.closeOverlay = true;
    }
  }

  onInputBlur(event) {
    this.focus = false;
    this.onBlur.emit(event);
  }

  private updateInputfield(values) {
    if (values) {
      const start = format(values.start, 'MMM D, YYYY');
      const end = format(values.end, 'MMM D, YYYY');
      this.inputFieldValue = `${start} — ${end}`;
    }
    else {
      this.inputFieldValue = '';
    }
  }

  private propagateChange = (_: any) => {
  };

  writeValue(value: any): void {
    if (value && typeof value !== 'undefined') {
      if (value.hasOwnProperty('start') && value.hasOwnProperty('end') && Object.keys(value).length === 2) {
        let newValues = {};
        for (let key in value) {
          if (value[key] instanceof Date) {
            newValues[key] = value[key];
          } else if (!isNaN(new Date(value[key]).getTime())) {
            newValues[key] = new Date(value[key]);
          }
        }
        this.initValues = newValues;
        this.form.setValue(newValues);
        this.checkForKnownRange(newValues);
        this.updateInputfield(newValues);

      }
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  constructor(private fb: FormBuilder, public el: ElementRef, public renderer: Renderer2, public cd: ChangeDetectorRef) {
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.documentClickListener) {
      this.documentClickListener();
    }
  }

  ngAfterViewInit() {
    this.overlay = <HTMLDivElement> this.overlayViewChild.nativeElement;

    if (this.appendTo) {
      if (this.appendTo === 'body') {
        document.body.appendChild(this.overlay);
      } else {
        // this.domHandler.appendChild(this.overlay, this.appendTo);
      }
    }

  }

  private isMonthRange(v){ 
    return isFirstDayOfMonth(v.start) && isLastDayOfMonth(v.end);
  }

  private isThisMonthRange(v){
    return (isThisMonth(v.start) && isThisMonth(v.end));
  }

  private isNextMonthRange(v){
    return (isThisMonth(subMonths(v.start, 1)) && isThisMonth(subMonths(v.end , 1)));
  }
  private isPreMonthRange(v){
    return (isThisMonth(addMonths(v.start, 1)) && isThisMonth(addMonths(v.end, 1)));
  }

  public isTenWeeks(v) {
    const control = {
      start: subWeeks(new Date(), 2),
      end: addWeeks(new Date(), 8)
    };
    return isSameDay(v.start, control.start) &&  isSameDay(v.end, control.end)
  }


  private checkForKnownRange(v){
    if(this.isMonthRange(v)){
      if(this.isThisMonthRange(v)){
        this.selected = 2;
        this.selectValue = 'This month';
      } else if(this.isNextMonthRange(v)) {
        this.selected = 3;
        this.selectValue = 'Next month';
      } else if(this.isPreMonthRange(v)) {
        this.selected = 1;
        this.selectValue = 'Prev month';
      }
        else{
          this.selected = 4
          this.selectValue = 'Custom';
        }
      }
    else if(this.isTenWeeks(v)) {
      this.selectValue = '-2 Weeks - +8 Weeks';
      this.selected = 0;
    }
    else{
      this.selected = 4
      this.selectValue = 'Custom';
    }
  }

  public inputChanged(control: FormControl, controlName: 'start'|'end') {
    const parsed = parse(control.value);
    const formControl = this.form.controls[controlName];
    const isValidDate = isValid(parsed);
    if (!isValidDate) {
      control.setErrors({ invalidDate: true });
      return;
    }
    control.setErrors(null);
    if (isValidDate && !isSameDay(parsed, formControl.value)) {
      formControl.setValue(parsed);
    }
  }

  private syncSelectionsToInput() {
    this.form.valueChanges
      .pipe(
        debounceTime(50),
        takeUntil(this.destroy$)
      ).subscribe(value => {
        const {start, end} = value;
        if (!isSameDay(start, this.fromControl.value)) {
          const startValue = format(start, 'MMM D, YYYY')
          this.fromControl.setValue(startValue);
        }
        if (!isSameDay(end, this.toControl.value)) {
          const endValue = format(end, 'MMM D, YYYY')
          this.toControl.setValue(endValue);
        }
      });
  }
  ngOnInit() {
    this.form = this.fb.group({
      start: [null, Validators.required],
      end: [null, Validators.required]
    });
    this.error = this.form
      .valueChanges
      .pipe(
        tap((v => this.checkForKnownRange(v))),
        map((value: {start: Date, end: Date}) => {
          const {start, end} = value;
          return isAfter(start, end) && !isSameDay(start, end) ? 'Start date is after end date' : null;
        })
      );
    this.syncSelectionsToInput();
  }
}