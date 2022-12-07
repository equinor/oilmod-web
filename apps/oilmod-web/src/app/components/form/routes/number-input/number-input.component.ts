import { Component } from '@angular/core';
import { DemoComponent } from '../../../demo.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { FormFieldDirective, NumberInputComponent } from '@ngx-stoui/form';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { NgIf } from '@angular/common';
import { code } from './code';

@Component({
  template: `
    <sto-demo [code]="code">
      <mat-card class="sto-form"
                style="width: 600px">
        <mat-checkbox [checked]="dynamicFractionSize"
                      color="primary"
                      (change)="dynamicFractionSize = $event.checked">Dynamic
          fraction size
        </mat-checkbox>
        <mat-checkbox [checked]="readonly"
                      color="primary"
                      (change)="readonly = $event.checked">Readonly
        </mat-checkbox>
        <mat-form-field stoFormField
                        floatLabel="always">
          <mat-label>Sto number input</mat-label>
          <sto-number-input [dynamicFractionSize]="dynamicFractionSize"
                            [fractionSize]="3"
                            [readonly]="readonly"
                            [formControl]="control">
          </sto-number-input>
          <span matSuffix>$</span>
          <mat-error *ngIf="control.hasError('required')">{{ control.getError('required') }}</mat-error>
        </mat-form-field>
        <br>
        {{control.value}}
      </mat-card>
    </sto-demo>`,
  standalone: true,
  imports: [
    DemoComponent,
    MatCardModule,
    FormFieldDirective,
    MatFormFieldModule,
    NumberInputComponent,
    ReactiveFormsModule,
    MatCheckboxModule,
    NgIf
  ]
})
export class DemoNumberInputComponent {
  public control = new FormControl<number | null>(null);
  public dynamicFractionSize = false;
  public readonly = false;
  public code = code;
}
