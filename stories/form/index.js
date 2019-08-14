import {storiesOf} from '@storybook/angular';
import {boolean, number, radios, select, text, withKnobs} from "@storybook/addon-knobs";
import {action} from '@storybook/addon-actions'
import {StoDaterangeModule} from "../../projects/stoui-form/src/lib/sto-daterange/sto-daterange.module";
import dateRangeReadme from "../../projects/stoui-form/src/lib/sto-daterange/sto-daterange.component.md";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {StoNumberInputModule} from "../../projects/stoui-form/src/lib/sto-number-input/sto-number-input.module";
import numberInputReadme from "../../projects/stoui-form/src/lib/sto-number-input/sto-number-input.component.md";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {StoDatepickerModule} from "../../projects/stoui-form/src/lib/sto-monthpicker";
import monthPickerReadme from "../../projects/stoui-form/src/lib/sto-monthpicker/sto-monthpicker.md";
import {MAT_LABEL_GLOBAL_OPTIONS, MatFormFieldModule, MatInputModule, MatNativeDateModule} from "@angular/material";
import {StoAutocompleteModule} from "../../projects/stoui-form/src/lib/sto-autocomplete/sto-autocomplete.module";
import autocompleteReadme from "../../projects/stoui-form/src/lib/sto-autocomplete/sto-autocomplete.component.md";
import {items} from "./item-list";
import {StoSlideToggleModule} from "../../projects/stoui-form/src/lib/sto-slide-toggle/sto-slide-toggle.component";
import {StoSelectFilterModule} from "../../projects/stoui-form/src/lib/sto-select-filter/sto-select-filter.module";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule} from "@angular/common";
import {StoFormModule} from "../../projects/stoui-form/src/lib/sto-form/sto-form.module";
import stoFormReadme from '../../projects/stoui-form/src/lib/sto-form/sto-form.md'

const stories = storiesOf('Forms', module)
  .addDecorator(withKnobs);

stories
  .add('Daterange', () => ({
    moduleMetadata: {
      declarations: [],
      imports: [StoDaterangeModule, ReactiveFormsModule, BrowserAnimationsModule]
    },
    template: `<div style="width: 250px" class="sto-form mat-typography">
<sto-daterange
[label]="label"
[showPickersOnFocus]="singlePickers"
[formControl]="control"></sto-daterange>
Value: {{ control.value | json }}
</div>`,
    props: {
      control: new FormControl(),
      label: text('Label', 'Date range'),
      singlePickers: boolean('Use single pickers', false)
    }
  }), {
    notes: dateRangeReadme
  });

stories.add('Number input', () => ({
  moduleMetadata: {
    imports: [StoNumberInputModule, BrowserAnimationsModule],
    schemas: [NO_ERRORS_SCHEMA]
  },
  template: `<div *ngIf="group" style="width: 250px" class="sto-form mat-typography">
<sto-number-input [textAlign]="textAlign" [forceValue]="value" [readonly]="readonly" [label]="label" [suffix]="suffix" [fractionSize]="fractionSize"></sto-number-input>
</div>`,
  props: {
    group: new FormGroup({nmbr: new FormControl()}),
    label: text('Label', 'Number input'),
    suffix: text('Suffix', '$'),
    fractionSize: number('Fraction size', 3),
    readonly: boolean('Readonly', false),
    value: number('Value', 100),
    textAlign: radios('Align', ['left', 'right'], 'left')
  }
}), {
  notes: {markdown: numberInputReadme}
});

stories.add('Monthpicker', () => ({
  moduleMetadata: {
    imports: [MatNativeDateModule, BrowserAnimationsModule, StoDatepickerModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  },
  template: `<div class="sto-form" style="width: 200px">
<mat-form-field class="sto-form__field" [stoMonthFormFieldClick]="picker">
<mat-label>Month</mat-label>
<input matInput [formControl]="ctrl" [mdMonthpicker]="picker">
<md-monthpicker-toggle matSuffix [for]="picker"></md-monthpicker-toggle>
<md-monthpicker #picker></md-monthpicker>
</mat-form-field>
</div>`,
  props: {
    ctrl: new FormControl(new Date())
  }
}), {
  notes: {markdown: monthPickerReadme}
});

stories.add('Autocomplete', () => ({
  moduleMetadata: {
    imports: [StoAutocompleteModule, BrowserAnimationsModule, ReactiveFormsModule]
  },
  template: `<div style="width: 200px">
<sto-autocomplete class="sto-form" [displayFn]="displayValue === 'name' ? displayFn : displayLongName" (ngModelChange)="changed($event)" label="Autocomplete" [valueKey]="valueKey" [searchForKey]="searchKey" [unfiltered]="items" [formControl]="ctrl"></sto-autocomplete>
</div>`,
  props: {
    ctrl: new FormControl(),
    items,
    searchKey: 'name',
    displayFn: value => value ? value.name : 'Empty',
    displayLongName: value => value ? value.longName : 'Empty',
    displayValue: select('Display by key', ['name', 'longName'], 'name'),
    valueKey: select('Which value should be emitted', ['id', 'name'], 'name'),
    changed: action('Value changed')
  }
}), {
  notes: {markdown: autocompleteReadme}
});

stories.add('Slide toggle', () => ({
  moduleMetadata: {
    imports: [StoSlideToggleModule, ReactiveFormsModule, BrowserAnimationsModule]
  },
  template: `<div style="width: 200px" class="sto-form">
<sto-slide-toggle (ngModelChange)="valueChange($event)" [formControl]="ctrl" label="Slide toggle"></sto-slide-toggle>
</div>`,
  props: {
    ctrl: new FormControl(),
    valueChange: action('Value changed')
  }
}));

stories.add('MatSelect filter', () => ({
  moduleMetadata: {
    imports: [StoSelectFilterModule, MatFormFieldModule, MatSelectModule, BrowserAnimationsModule, CommonModule]
  },
  template: `
<div style="width: 300px" class="sto-form" (click)="flip()">
<mat-form-field *ngIf="multi" class="sto-form__field" floatLabel="always" >
<mat-label>Multiselect with filter</mat-label>
  <mat-select [multiple]="true" [value]="selected">
    <sto-select-filter (keydown.space)="$event.stopPropagation()" [isFilter]="true" [isMulti]="true" (valueChanges)="filteredItems = filter($event, allItems)"
    (selectAll)="selected = $event ? filteredItems :[]; selectAll($event)"></sto-select-filter>
    <mat-option *ngFor="let opt of filteredItems" [value]="opt">{{opt.name}}</mat-option>
</mat-select>
</mat-form-field>

<mat-form-field *ngIf="!multi" class="sto-form__field" floatLabel="always">
<mat-label>Select with filter</mat-label>
  <mat-select [multiple]="false" [value]="selected">
    <sto-select-filter (keydown.space)="$event.stopPropagation()" [isFilter]="true" [isMulti]="false" (valueChanges)="filteredItems = filter($event, allItems)"
    (selectAll)="selected = $event ? filteredItems :[]; selectAll($event)"></sto-select-filter>
    <mat-option *ngFor="let opt of filteredItems" [value]="opt">{{opt.name}}</mat-option>
</mat-select>
</mat-form-field>
</div>
  `,
  props: {
    filter: (event, all) => {
      action('Filter by value')(event);
      const re = new RegExp(event || '');
      return all.filter(el => re.test(el.name));
    },
    selectAll: action('Select all'),
    flip: () => {
    },
    selected: [],
    multi: boolean('Multiple', false),
    filteredItems: items,
    allItems: items
  }
}));

stories.add('StoFormField', () => ({
  moduleMetadata: {
    imports: [MatFormFieldModule, MatInputModule, StoFormModule, MatSelectModule, BrowserAnimationsModule],
    providers: [{provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: {float: 'always'}}]
  },
  template: `<div class="sto-form">
<mat-form-field stoFormField *ngIf="withClasses">
<mat-label>Form field with styles</mat-label>
<input value="Some value" [disabled]="disabled" [readonly]="readonly" matInput>
</mat-form-field>
<mat-form-field stoFormField *ngIf="withClasses">
<mat-label>Form field with styles</mat-label>
<mat-select><mat-option>A</mat-option></mat-select>
</mat-form-field>
<mat-form-field appearance="fill" *ngIf="!withClasses">
<mat-label>Form field without styles</mat-label>
<input value="Some value" [disabled]="disabled" [readonly]="readonly" matInput>
</mat-form-field>
</div>`,
  props: {
    withClasses: boolean('Use styling', true),
    readonly: boolean('Readonly', false),
    disabled: boolean('Disabled', false)
  }
}), {
  notes: {markdown: stoFormReadme}
});
