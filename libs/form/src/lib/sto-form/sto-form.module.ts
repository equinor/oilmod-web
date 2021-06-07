import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormFieldDirective } from './form-field.directive';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [ FormFieldDirective ],
  imports: [
    CommonModule,
    MatFormFieldModule
  ],
  exports: [ FormFieldDirective ],
  providers: [
    // { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' }}
  ]
})
export class StoFormModule {
}
