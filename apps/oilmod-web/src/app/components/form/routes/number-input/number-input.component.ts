
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormFieldDirective, NumberInputComponent } from '@ngx-stoui/form';
import { DemoComponent } from '../../../demo.component';
import { code } from './code';

@Component({
    template: ` <sto-demo [code]="code">
      <mat-card class="sto-form" style="width: 600px">
        <mat-checkbox
          [checked]="dynamicFractionSize"
          color="primary"
          (change)="dynamicFractionSize = $event.checked"
          >Dynamic fraction size
        </mat-checkbox>
        <mat-checkbox
          [checked]="readonly"
          color="primary"
          (change)="readonly = $event.checked"
          >Readonly
        </mat-checkbox>
        <mat-form-field stoFormField floatLabel="always">
          <mat-label>Sto number input</mat-label>
          <sto-number-input
            [dynamicFractionSize]="dynamicFractionSize"
            [fractionSize]="3"
            [readonly]="readonly"
            [formControl]="control"
            >
          </sto-number-input>
          <span matSuffix>$</span>
          @if (control.hasError('required')) {
            <mat-error>{{
              control.getError('required')
            }}</mat-error>
          }
        </mat-form-field>
        <br />
        {{ control.value }}
      </mat-card>
    </sto-demo>`,
    imports: [
    DemoComponent,
    MatCardModule,
    FormFieldDirective,
    MatFormFieldModule,
    NumberInputComponent,
    ReactiveFormsModule,
    MatCheckboxModule
]
})
export class DemoNumberInputComponent {
  public control = new FormControl<number | null>(null);
  public dynamicFractionSize = false;
  public readonly = false;
  public code = code;
}
