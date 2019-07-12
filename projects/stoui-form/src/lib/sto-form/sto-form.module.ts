import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldDirective } from './form-field.directive';
import { MatFormFieldModule } from '@angular/material';

@NgModule({
  declarations: [ FormFieldDirective ],
  imports: [
    CommonModule,
    MatFormFieldModule
  ],
  exports: [ FormFieldDirective ]
})
export class StoFormModule {
}
