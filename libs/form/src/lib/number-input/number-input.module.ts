import { NumberUnitInputComponent } from './number-unit-input/number-unit-input.component';
import { NumberInputComponent } from './number-input/number-input.component';
import { NumberInputDirective } from './number-input.directive';
import { NumberInputPipe } from './number-input.pipe';


import { NgModule } from '@angular/core';

@NgModule({
  imports: [ NumberUnitInputComponent, NumberInputComponent, NumberInputDirective, NumberInputPipe ],
  exports: [ NumberUnitInputComponent, NumberInputComponent, NumberInputDirective, NumberInputPipe ]
})
export class NumberInputModule {
}
