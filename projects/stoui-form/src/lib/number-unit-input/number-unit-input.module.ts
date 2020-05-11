import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberUnitInputComponent } from './number-unit-input/number-unit-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [ NumberUnitInputComponent ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule
  ],
  exports: [
    NumberUnitInputComponent
  ]
})
export class NumberUnitInputModule {
}
