import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input, OnInit,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material';
import { Key } from '../shared/abstract-and-interfaces/keyPress.enum';
import { map, debounceTime, tap } from 'rxjs/operators';

@Component({
  selector: 'sto-autocomplete',
  templateUrl: './autocomplete.component.html',
  styles: [`mat-form-field {
      width: 100%
  }`],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StoAutocompleteComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => StoAutocompleteComponent),
      multi: true,
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * StoAutocompleteComponent is a wrapper for angular material's auto complete
 * It takes care of a lot of the grunt work required by the original one, and simplifies usage by automatically
 * ensuring the value set exists in the list
 */
export class StoAutocompleteComponent implements OnInit, ControlValueAccessor, Validator {
  @ViewChild(MatAutocompleteTrigger) searchInput: MatAutocompleteTrigger;
  /**
   * unfiltered list of items to search for
   */
  @Input() unfiltered: any[];
  /**
   * Placeholder text
   */
  @Input() placeholder: string;
  /**
   * Display function. Takes in the item, and returns a key. Example:
   * public displayQualityName(quality: Quality) {
   *   return quality ? quality.material : 'No Regrade';
   * }
   */

  @Input() label: string;

  @Input() displayFn: Function;
  /**
   * valueKey is the key that gets emitted (often the elements ID)
   */
  @Input() valueKey: string;
  /**
   * searchForKey is the key used in regex searches
   */
  @Input() searchForKey: string;
  /**
   * Desired validation message (optional)
   * @type {string}
   */
  @Input() validationMessage = `Invalid option selected`;
  /**
   * ignoreValidation set to true to disable validation handling
   * @type {boolean}
   */
  @Input() ignoreValidation = false;
  @Input() helpText: string;
  @Input() get inheritedErrors(): ValidationErrors | null {
    return this._inheritedErrors;
  };
  set inheritedErrors(errors: ValidationErrors | null) {
    this._inheritedErrors = errors;
    if (errors) {
      this.searchControl.markAsTouched();
    }
  }
  public elementHasFocus: boolean;
  private _inheritedErrors: ValidationErrors | null;
  public filtered$: Observable<any[]>;
  public searchControl = new FormControl();
  public errors: ValidationErrors | null;
  public markAsTouched() {
    if (this.searchControl) {
      this.searchControl.markAsTouched();
      this.searchControl.markAsDirty();
    }
  }
  constructor(private cdr: ChangeDetectorRef) {}

  validate(c: AbstractControl) {
    if (this.ignoreValidation) {
      this.errors = c.errors;
      return null;
    }
    const value = this.searchControl.value;
    const isInvalid = typeof value === 'string';
    const error = isInvalid && value ? {optionSelected: this.validationMessage} : null;
    this.errors = (c.errors || error) ? Object.assign({}, c.errors, error) : null;
    this.cdr.markForCheck();
    return !isInvalid ? null : error;
  }

  onEnter(event?: KeyboardEvent) {
    if (event && event.keyCode === Key.Enter) {
      event.stopPropagation();
    }
    const {value} = this.searchControl;
    const results = this.unfiltered.filter(item => item[this.searchForKey].match(new RegExp(value, 'i')));
    if (results.length === 1) {
      this.searchControl.setValue(results[0]);
      this.propagateChange(results[0][this.valueKey]);
      this.searchInput.closePanel();
    }
  }

  public onSelect(event: MatAutocompleteSelectedEvent) {
    const v = event.option.value[this.valueKey];
    this.propagateChange(v);
  }

  writeValue(value: any) {
    if (value) {
      const foundElement = this.unfiltered.find(el => el[this.valueKey] === value);
      this.searchControl.setValue(foundElement);
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
      const curr = el[this.searchForKey];
      if (startsWithRegex.test(curr)) {
        first.push(el);
      } else {
        others.push(el);
      }
    });
    return [...first, ...others];
  }

  private filterSearch(unfiltered: any[], search: string): any[] {
    const searchAsRegex = new RegExp(search, 'i');
    const filtered = unfiltered
      .filter(item => searchAsRegex.test(item[this.searchForKey]));
    return filtered;
  }

  private searchChanged = () => map((search: string) => {
    const filtered = this.filterSearch([...this.unfiltered], search);
    const sorted = this.sortSearchByRelevance(filtered, search);
    return sorted;
  });

  public emitSearchChanged = () => tap((value: string) => {
    if (typeof value === 'string') {
      if (value === '') {
        value = null;
      }
      this.propagateChange(value);
    }
  });

  ngOnInit() {
    this.filtered$ = this.searchControl
      .valueChanges
      .pipe(
        debounceTime(50),
        this.emitSearchChanged(),
        this.searchChanged()
      );
  }

}
