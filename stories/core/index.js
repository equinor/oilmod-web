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
