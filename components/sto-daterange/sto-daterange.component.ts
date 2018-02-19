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
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
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
  isSameDay
} from 'date-fns';

// TODO: Rewrite hide / Show logic (overlay)

@Component({
  selector: 'sto-daterange',
  templateUrl: './sto-daterange.component.html',
  styleUrls: ['./sto-daterange.component.scss'],
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

  public dateClick: boolean;
  public overlay: HTMLDivElement;
  public closeOverlay: boolean;
  public focus: boolean;
  public overlayVisible: boolean;
  public overlayShown: boolean;
  public value: any;
  public inputFieldValue: string = '';
  public hasError: string;
  public error: Observable<string>;
  public selectValue = 'Custom';
  public selected: number = 4;
  /*<mat-option [ngValue]="{ type: 'tenweeks', }">-2 weeks – +8 weeks</mat-option>
<mat-option>Previous month</mat-option>
<mat-option>This month</mat-option>
<mat-option>Next month</mat-option>
<mat-option [value]="null">Custom</mat-option>
  public periodPicker(unit: 'week' | 'month', when: string): void {
*/

  private documentClickListener: any;
  @HostListener('document:keydown.escape ', ['$event']) onEscape(event) {
    this.onCancel();
  }

  public showOverlay(inputfield?) {
    this.overlayVisible = true;
    this.overlayShown = true;
    // this.overlay.style.zIndex = String(++DomHandler.zindex);

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
    // this.onModelTouched();
  }

  private updateInputfield(values) {
    if (values) {
      const start = format(values.start, 'MMM DD, YYYY');
      const end = format(values.end, 'MMM DD, YYYY');
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

  ngOnInit() {
    this.form = this.fb.group({
      start: [null, Validators.required],
      end: [null, Validators.required]
    });
    this.error = this.form
      .valueChanges
      .do(v => this.checkForKnownRange(v))
      .map((value: {start: Date, end: Date}) => {
        const {start, end} = value;
        return isAfter(start, end) ? 'Start date is after end date' : null;
      });
  }
}