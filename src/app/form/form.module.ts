import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import {
  StoAutocompleteModule,
  StoDatepickerModule,
  StoDaterangeModule,
  StoNumberInputModule,
  StoSelectFilterModule,
  StoSlideToggleModule,
} from '@ngx-stoui/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatNativeDateModule, MatSelectModule } from '@angular/material';
import { StoDirectivesModule } from '@ngx-stoui/core';

@NgModule({
  imports: [
    CommonModule,
    FormRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    StoAutocompleteModule, StoDatepickerModule, StoNumberInputModule, StoSelectFilterModule, StoDaterangeModule, StoSlideToggleModule,
    MatSelectModule,
    StoDirectivesModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  declarations: [ FormComponent ],
})
export class FormModule {
}
