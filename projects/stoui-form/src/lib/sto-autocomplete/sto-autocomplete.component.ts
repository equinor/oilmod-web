import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Host,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  SkipSelf,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Key } from '@ngx-stoui/core';
import { debounceTime, filter, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { MonoTypeOperatorFunction, Observable, Subject } from 'rxjs';
import { AutoCompleteValidator } from './sto-autocomplete.validate';


@Component({
  selector: 'sto-autocomplete',
  templateUrl: './sto-autocomplete.component.html',
  styles: [ `mat-form-field {
    width: 100%
  }` ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StoAutocompleteComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * StoAutocompleteComponent is a wrapper for angular material's auto complete
 * It takes care of a lot of the grunt work required by the original one, and simplifies usage by automatically
 * ensuring the value set exists in the list
 */
export class StoAutocompleteComponent implements OnInit, ControlValueAccessor, AfterViewInit, OnDestroy {
  @Input() formControlName: string;
  @ViewChild(MatAutocompleteTrigger, { static: true }) searchInput: MatAutocompleteTrigger;
  /**
   * Unfiltered list of items to search for
   */
  @Input() unfiltered: any[];
  /**
   * Text in the input field when no value.
   */
  @Input() placeholder: string;

  /**
   * Label above the input field.
   */
  @Input() label: string;
  /**
   * Display function. Takes in the item, and returns a key. Example:
   * public displayQualityName(quality: Quality) {
   *   return quality ? quality.material : 'No Regrade';
   * }
   */
  @Input() displayFn: Function;
  /**
   * valueKey is the key that gets emitted (often the elements ID)
   */
  @Input() valueKey: string;
  /**
   * searchForKey is the key used in searches. Defaults to 'id', but could be 'qualityName'.
   */
  @Input() searchForKey: string;
  /**
   * Desired validation message (optional)
   *  {string}
   */
  @Input() validationMessage = `Invalid option selected`;
  /**
   * ignoreValidation set to true to disable validation handling
   *  {boolean}
   */
  @Input() ignoreValidation = false;
  /**
   * ignoredIds is a list of Ids that should be ignored in filter
   *  {any}
   */
  @Input() ignoredIds: any[];

  /**
   * Help/hint text below the input
   */
  @Input() helpText: string;

  /**
   * @deprecated inheritedErrors are now being retrieved from the host control, rendering this moot.
   * {ValidationErrors | null}
   */
  @Input() get inheritedErrors(): ValidationErrors | null {
    return this._inheritedErrors;
  }

  set inheritedErrors(errors: ValidationErrors | null) {
    this._inheritedErrors = errors;
    if ( errors ) {
      this.searchControl.markAsTouched();
    }
  }

  public elementHasFocus: boolean;
  private destroyed$ = new Subject();
  private _inheritedErrors: ValidationErrors | null;
  public filtered$: Observable<any[]>;
  public searchControl = new FormControl();
  public errors: ValidationErrors | null;

  public markAsTouched() {
    if ( this.searchControl ) {
      this.searchControl.markAsTouched();
      this.searchControl.markAsDirty();
    }
  }

  public parent: AbstractControl;

  constructor(private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              @Optional() @Host() @SkipSelf()
              private controlContainer: ControlContainer,) {
  }

  onEnter(event?: KeyboardEvent) {
    if ( event && event.keyCode === Key.Enter ) {
      event.stopPropagation();
    }
    const { value } = this.searchControl;

    const results = this.unfiltered
      .filter(item => {
        if ( !this.ignoredIds || item.id === null ) {
          return true;
        }
        return this.ignoredIds.indexOf(item.id) === -1;
      })
      .filter(item => item[ this.searchForKey ].match(new RegExp(value, 'i')));
    const directMatchRe = new RegExp(`^${value}$`, 'i');
    const directMatch = this.unfiltered
      .find(item => directMatchRe.test(item[ this.searchForKey ]));

    if ( results.length === 1 ) {
      this.searchControl.setValue(results[ 0 ]);
      this.propagateChange(results[ 0 ][ this.valueKey ]);
      this.searchInput.closePanel();
    } else if ( directMatch ) {
      this.searchControl.setValue(directMatch);
      this.propagateChange(directMatch[ this.valueKey ]);
      this.searchInput.closePanel();
    }
  }

  public onSelect(event: MatAutocompleteSelectedEvent) {
    const v = event.option.value[ this.valueKey ];
    this.propagateChange(v);
  }

  writeValue(value: any) {
    if ( value ) {
      const foundElement = this.unfiltered.find(el => el[ this.valueKey ] === value);
      this.searchControl.setValue(foundElement);
    } else {
      this.searchControl.setValue(null);
    }
  }

  propagateChange = (_: any) => {
  };

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  private sortSearchByRelevance(input: any[], startsWith: string): any[] {
    const first = [];
    const others = [];
    const startsWithRegex = new RegExp('^' + startsWith, 'i');
    input.forEach(el => {
      const curr = el[ this.searchForKey ];
      if ( startsWithRegex.test(curr) ) {
        first.push(el);
      } else {
        others.push(el);
      }
    });
    return [ ...first, ...others ];
  }

  private filterSearch(unfiltered: any[], search: string): any[] {
    const searchAsRegex = new RegExp(search, 'i');
    const filtered = unfiltered
      .filter(item => searchAsRegex.test(item[ this.searchForKey ]));
    return filtered;
  }

  private searchChanged = () => map((search: string) => {
    const filtered = this.filterSearch([ ...this.unfiltered ], search);
    const sorted = this.sortSearchByRelevance(filtered, search);
    return sorted;
  });

  public emitSearchChanged = (): MonoTypeOperatorFunction<string> => tap((value: string) => {
    if ( typeof value === 'string' ) {
      if ( value === '' ) {
        value = null;
      }
      this.beforePropagateChange(value);
    }
  });

  private beforePropagateChange(value) {
    if ( this.controlContainer ) {
      const parent = this.controlContainer.control.get(this.formControlName);
      parent.updateValueAndValidity({ onlySelf: true });
      this.propagateChange(value);
    }
  }

  private mapErrors() {
    return map(() => {
      return this.parent.errors;
    });
  }

  private monkeypatchSetValidators(control: AbstractControl) {
    const origFunc = control.setValidators;
    const self = this;
    control.setValidators = function (newValidator: ValidatorFn | ValidatorFn[] | null) {
      let args = [];
      if ( newValidator instanceof Array ) {
        args = [ ...newValidator ];
      } else if ( !!newValidator ) {
        args.push(newValidator);
      }
      if ( !self.ignoreValidation ) {
        args.push(AutoCompleteValidator(self.unfiltered, self.valueKey));
      }
      origFunc.apply(this, [ args ]);
    };
  }

  ngOnInit() {
    const container = this.controlContainer;
    if ( container ) {
      this.parent = this.formControlName ? container.control.get(this.formControlName) : container.control;
    }
    const validators = [];
    validators.push(AutoCompleteValidator(this.unfiltered, this.valueKey));
    if ( this.parent ) {
      if ( this.parent.validator ) {
        validators.push(this.parent.validator);
      }
      if ( !this.ignoreValidation ) {
        this.parent.setValidators(Validators.compose(validators));
      }
      this.monkeypatchSetValidators(this.parent);
      this.parent.valueChanges.pipe(
        startWith(''),
        this.mapErrors(),
        takeUntil(this.destroyed$)
      ).subscribe(err => {
        this.errors = err;
        if ( this.parent.touched && this.searchControl.untouched ) {
          this.searchControl.markAsTouched();
        }
        this.cdr.markForCheck();
      });
    }


    this.filtered$ = this.searchControl
      .valueChanges
      .pipe(
        debounceTime(50),
        filter(item => {
          if ( !this.ignoredIds || item.id === null ) {
            return true;
          }
          return this.ignoredIds.indexOf(item.id) === -1;
        }),
        this.emitSearchChanged(),
        this.searchChanged()
      );
  }

  ngAfterViewInit(): void {
    this.searchInput.panelClosingActions.subscribe((c) => {
      this.onEnter();
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
