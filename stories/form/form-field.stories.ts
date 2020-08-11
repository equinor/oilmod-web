import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { MatCardModule } from '@angular/material/card';
import { FormFieldDirective, StoFormModule } from '../../projects/stoui-form/src/public_api';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatInputModule } from '@angular/material/input';
import stoFormReadme from '../../projects/stoui-form/src/lib/sto-form/sto-form.md';

export default {
  title: 'form/Form field directive',
  component: FormFieldDirective,
  parameters: {
    notes: { markdown: stoFormReadme }
  },
  decorators: [
    moduleMetadata({
      imports: [ MatFormFieldModule, MatInputModule, StoFormModule, MatSelectModule,
        BrowserAnimationsModule, MatCardModule, TextFieldModule ],
      providers: [ { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'always' } } ]
    }),

  ],
} as Meta;

const Template: Story<FormFieldDirective> = (args) => {
  return {
    component: FormFieldDirective,
    props: args,
    template: `
  <mat-card class="sto-form">
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
</mat-card>`
  };
};

export const Usage = Template.bind({});
Usage.args = {
  withClasses: true,
  readonly: false,
  disabled: false,
};
