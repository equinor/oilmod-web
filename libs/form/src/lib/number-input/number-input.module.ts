import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberUnitInputComponent } from './number-unit-input/number-unit-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NumberInputComponent } from './number-input/number-input.component';
import { NumberInputDirective } from './number-input.directive';
import { NumberInputPipe } from './number-input.pipe';


@NgModule({
  declarations: [ NumberUnitInputComponent, NumberInputComponent, NumberInputDirective, NumberInputPipe ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  exports: [
    NumberUnitInputComponent, NumberInputComponent, NumberInputDirective, NumberInputPipe
  ],
  providers: [ NumberInputPipe ]
})
export class NumberInputModule {
}
