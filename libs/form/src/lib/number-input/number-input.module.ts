import { NgModule } from '@angular/core';
import { NumberInputComponent } from './number-input/number-input.component';
import { NumberInputDirective } from './number-input.directive';
import { NumberInputPipe } from './number-input.pipe';
import { NumberUnitInputComponent } from './number-unit-input/number-unit-input.component';

/**
 * @deprecated Import the components directly instead.
 * This module is kept for backward compatibility only.
 */
@NgModule({
  imports: [NumberUnitInputComponent, NumberInputComponent, NumberInputDirective, NumberInputPipe],
  exports: [NumberUnitInputComponent, NumberInputComponent, NumberInputDirective, NumberInputPipe],
})
export class NumberInputModule {}
