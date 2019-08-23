import {storiesOf} from '@storybook/angular';
import {boolean, object, withKnobs} from '@storybook/addon-knobs';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule} from "@angular/common";
import {StoFormModule} from "../../projects/stoui-form/src/lib/sto-form/sto-form.module";
import {StoDirectivesModule} from "../../projects/stoui-core/src/lib/sto-directives/directives.module";
import {StoUserPreferenceModule} from "@ngx-stoui/core";
import {StoNumberInputModule} from "../../projects/stoui-form/src/lib/sto-number-input/sto-number-input.module";
import {StoDatatableModule} from "../../projects/stoui-datatable/src/lib/sto-datatable/sto-datatable.module";
import {columns, rows} from '../datatable/rows';

const stories = storiesOf('Core (styling)', module)
  .addDecorator(withKnobs);

stories.add('StoCard', () => ({
  moduleMetadata: {
    declarations: [],
    imports: [MatCardModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule, CommonModule, MatButtonModule, StoFormModule, StoUserPreferenceModule.forRoot()]
  },
  template: `<mat-card [class.sto-card]="withClasses">
<mat-card-title [class.sto-card__title]="withClasses">
Card title
<button mat-button color="primary">Action</button>
</mat-card-title>

<mat-card-subtitle [class.sto-card__subtitle]="withClasses">Card subtitle</mat-card-subtitle>
<mat-card-content class="sto-form">
<mat-form-field #ff="stoFormField" stoFormField>
<mat-label>Input label</mat-label>
<input [readonly]="readonly" [disabled]="disabled" matInput value="Input value">
</mat-form-field>
</mat-card-content>
</mat-card>`,
  props: {
    withClasses: boolean('Use styling', true),
    disabled: boolean('disabled', false),
    readonly: boolean('readonly', false),
  }
}), {
  notes: 'Card with sto-style is largely used for input fields, to align the title with labels.'
});

stories.add('StoGrid', () => ({
  moduleMetadata: {
    declarations: [],
    imports: [BrowserAnimationsModule, CommonModule]
  },
  template: `
<div class="sto-grid sto-grid--2" style="margin-bottom: 8px;">
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--2</div>  
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--2</div>  
</div>
<div class="sto-grid sto-grid--3" style="margin-bottom: 8px;">
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--3</div>  
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--3</div>  
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--3</div>  
</div>
<div class="sto-grid sto-grid--4" style="margin-bottom: 8px;">
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--4</div>  
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--4</div>  
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--4</div>  
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--4</div>  
</div>
<div class="sto-grid sto-grid--6" style="margin-bottom: 8px;">
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>  
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>  
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>  
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>  
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>  
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>  
</div>
  `,
  props: {
    withClasses: boolean('Use styling', true),
    disabled: boolean('disabled', false),
    readonly: boolean('readonly', false),
  }
}), {
  notes: 'sto-grid--4 is responsive and wraps'
});

stories.add('StoGridDirective', () => ({
  moduleMetadata: {
    declarations: [],
    imports: [BrowserAnimationsModule, CommonModule, StoDirectivesModule, StoNumberInputModule, MatCardModule, StoDatatableModule]
  },
  template: `
<mat-card class="sto-card">
<div style="background: white;" stoGrid [maxWidth]="1000" [breakpoints]="breakpoints">
<div stoGridColumn style="background: lightblue;">1 (col)</div>
<div stoGridColumn style="background: lightblue;">2 (col)</div>
<div stoGridColumn style="background: lightblue;">3 (col)</div>
<div stoGridColumn style="background: lightblue;">4 (col)</div>
<div stoGridColumn style="background: lightblue;">5 (col)</div>
<div stoGridColumn style="background: lightblue;">6 (col)</div>
<div stoGridColumn [stoGridColumnDouble]="true" style="background: lightblue;">7 (double col)</div>
<div stoGridColumn [stoGridColumnDouble]="true" style="background: lightblue;">8 (double col)</div>
<div stoGridColumn [stoGridColumnDouble]="true" stoGridSpacer>9 (double spacer, hidden on 2-col)</div>
<div stoGridColumn [stoGridColumnDouble]="true" style="background: lightblue;">10 (double col)</div>
<div stoGridColumn style="background: lightblue;">11 (col)</div>
<div stoGridColumn stoGridSpacer>12 (spacer, hidden on 1-col)</div>
<div stoGridColumn style="background: transparent;" class="sto-form"><sto-number-input [forceValue]="123.456" label="Input field in grid"></sto-number-input></div>
<div stoGridColumn stoGridSpacer style="background: lightblue;">13 (col spacer, hidden on 1-col grid)</div>
<div stoGridColumn stoGridSpacer style="background: lightblue;" [stoGridColumnDouble]="true" >14 (double spacer, hidden on 2-col)</div>
</div>
</mat-card>
<mat-card class="sto-card sto-card--table">
<sto-datatable [elevation]="false" [autoSize]="true" [autoSizeOffset]="30" [responsiveView]="resp" [responsive]="true" [responsiveBreakPoint]="breakpoints[2] - 15" [columns]="columns" [rows]="rows"></sto-datatable>
<ng-template #resp let-row="row">{{ row.invoiceNo }} -- {{ row.voyageNo }}</ng-template>
</mat-card>
  `,
  props: {
    breakpoints: object('Breakpoints', {
      2: 400,
      4: 800
    }),
    columns: columns,
    rows: rows
  }
}), {
  notes: 'StoGridDirective is designed to be a responsive grid, which bases itself on the container size to determine how big each column should be. NOTE: Will only function in Chrome / Chromium'
});
