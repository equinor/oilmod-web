import {storiesOf} from '@storybook/angular';
import {boolean, number, radios, text, withKnobs} from "@storybook/addon-knobs";
import {StoDaterangeModule} from "../../projects/stoui-form/src/lib/sto-daterange/sto-daterange.module";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import '../../src/styles.scss'
import {StoNumberInputModule} from "../../projects/stoui-form/src/lib/sto-number-input/sto-number-input.module";
import {StoDirectivesModule} from "../../projects/stoui-core/src/lib/sto-directives/directives.module";
import {NO_ERRORS_SCHEMA} from "@angular/core";

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
  }));

stories.add('Number input', () => ({
  moduleMetadata: {
    imports: [StoNumberInputModule, StoDirectivesModule, ReactiveFormsModule, BrowserAnimationsModule],
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
}));
