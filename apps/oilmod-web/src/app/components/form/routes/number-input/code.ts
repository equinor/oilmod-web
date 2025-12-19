export const code = `import { Component } from '@angular/core';
import { DemoComponent } from '../../../demo.component';
import { MatCardModule } from '@angular/material/card';
import { FormFieldDirective, NumberInputComponent } from '@ngx-stoui/form';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgIf } from '@angular/common';

@Component({
  template: \`
    <sto-demo code="Halp">
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
          @if (control.hasError('required')) {
            <mat-error>{{ control.getError('required') }}</mat-error>
          }
        </mat-form-field>
        <br>
        {{control.value}}
      </mat-card>
    </sto-demo>\`,
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
}
`;
