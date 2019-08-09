import {storiesOf} from '@storybook/angular';
import {boolean, withKnobs} from '@storybook/addon-knobs';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatInputModule} from "@angular/material";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CommonModule} from "@angular/common";
import {StoFormModule} from "../../projects/stoui-form/src/lib/sto-form/sto-form.module";
import {StoUserPreferenceModule} from "@ngx-stoui/core";

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


stories.add('Stogrid', () => ({
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
