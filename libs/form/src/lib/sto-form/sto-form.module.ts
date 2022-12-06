import { FormFieldDirective } from './form-field.directive';

/**
 * @deprecated FormFieldDirective is standalone, import it directly.
 */
import { NgModule } from '@angular/core';

@NgModule({
  imports: [ FormFieldDirective ],
  exports: [ FormFieldDirective ]
})
export class StoFormModule {
}
