import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  Renderer,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import 'rxjs/add/operator/debounceTime';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import {
  addMonths, addWeeks, endOfMonth, endOfWeek, format, startOfMonth, startOfWeek, subMonths,
  subWeeks
} from 'date-fns';

@Component({
  selector: 'sto-daterange',
  templateUrl: './sto-daterange.component.html',
  styleUrls: [ './sto-daterange.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StoDaterangeComponent),
      multi: true
    },
    DomHandler
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
export class StoDaterangeComponent implements ControlValueAccessor, OnInit, AfterViewInit {

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

  @ViewChild('inputfield') inputfieldViewChild: ElementRef;

  public form: FormGroup;

  public dateClick: boolean;
  public overlay: HTMLDivElement;
  public closeOverlay: boolean;
  public focus: boolean;
  public overlayVisible: boolean;
  public overlayShown: boolean;
  public value: any;
  public inputFieldValue: string = '';

  private documentClickListener: any;

  public showOverlay( inputfield ) {
    this.overlayVisible = true;
    this.overlayShown = true;
    this.overlay.style.zIndex = String(++DomHandler.zindex);

    this.bindDocumentClickListener();
  }

  public onCancel() {
    this.overlayVisible = false;
    this.closeOverlay = true;
    this.form.reset();
  }

  public onSubmit() {
    this.overlayVisible = false;
    this.closeOverlay = true;
    let { start, end } = this.form.value;
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
    this.onSubmit();
  }

  public periodPicker( unit: 'week' | 'month', when: string ): void {
    const week = unit === 'week';
    const addFn = unit === 'week' ? addWeeks : addMonths;
    const subFn = unit === 'week' ? subWeeks : subMonths;
    const startFn = unit === 'week' ? startOfWeek : startOfMonth;
    const endFn = unit === 'week' ? endOfWeek : endOfMonth;
    switch (when) {
      case '-':
        this.form.setValue({
          start: week ? startOfWeek(subFn(new Date(), 1), { weekStartsOn: 1 }) : startOfMonth(subFn(new Date(), 1)),
          end: week ? endOfWeek(subFn(new Date(), 1), { weekStartsOn: 1 }) : endOfMonth(subFn(new Date(), 1))
        });
        break;
      case '+':
        this.form.setValue({
          start: week ? startOfWeek(addFn(new Date(), 1), { weekStartsOn: 1 }) : startOfMonth(addFn(new Date(), 1)),
          end: week ? endOfWeek(addFn(new Date(), 1), { weekStartsOn: 1 }) : endOfMonth(addFn(new Date(), 1))
        });
        break;
      default:
        this.form.setValue({
          start: week ? startOfWeek(new Date(), { weekStartsOn: 1 }) : startOfMonth(new Date()),
          end: week ? endOfWeek(addFn(new Date(), 1), { weekStartsOn: 1 }) : endOfMonth(addFn(new Date(), 1))
        });
        break;
    }
    this.onSubmit();
  }

  /**
   * This function creates a perf hit, as it triggers a global DOM listener for all click events
   */
  public bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = this.renderer.listenGlobal('document', 'click', ( event ) => {

        // Don't close if inside the date range picker
        for (const el of event.path) {
          if (el.localName === 'sto-calendar' || el.localName === 'sto-daterange') {
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

  onInputFocus( inputfield, event ) {
    this.focus = true;
    this.showOverlay(inputfield);
    this.onFocus.emit(event);
  }

  onButtonClick( event, inputfield ) {
    this.closeOverlay = false;

    if (!this.overlay.offsetParent) {
      inputfield.focus();
      this.showOverlay(inputfield);
    }
    else {
      this.closeOverlay = true;
    }
  }

  onInputBlur( event ) {
    this.focus = false;
    this.onBlur.emit(event);
    // this.onModelTouched();
  }

  private updateInputfield( values ) {
    if (values) {
      const start = format(values.start, 'YYYY-MM-DD');
      const end = format(values.end, 'YYYY-MM-DD');
      this.inputFieldValue = `${start} - ${end}`;
    }
    else {
      this.inputFieldValue = '';
    }
  }

  private propagateChange = ( _: any ) => {
  };

  writeValue( value: any ): void {
    if (value && typeof value !== 'undefined') {
      if (value.hasOwnProperty('start') && value.hasOwnProperty('end') && Object.keys(value).length === 2) {
        let newValues = {};
        for (let key in value) {
          if (value[ key ] instanceof Date) {
            newValues[ key ] = value[ key ];
          } else if (!isNaN(new Date(value[key]).getTime())) {
            newValues[key] = new Date(value[key]);
          }
        }
        this.form.setValue(newValues);
        this.updateInputfield(newValues);
      }
    }
  }

  registerOnChange( fn: any ): void {
    this.propagateChange = fn;
  }

  registerOnTouched( fn: any ): void {
  }

  constructor( private fb: FormBuilder, public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer, public cd: ChangeDetectorRef ) {
  }

  ngAfterViewInit() {
    this.overlay = <HTMLDivElement> this.overlayViewChild.nativeElement;

    if (this.appendTo) {
      if (this.appendTo === 'body') {
        document.body.appendChild(this.overlay);
      } else {
        this.domHandler.appendChild(this.overlay, this.appendTo);
      }
    }

  }

  ngOnInit() {
    this.form = this.fb.group({
      start: [ null, Validators.required ],
      end: [ null, Validators.required ]
    });

  }
}