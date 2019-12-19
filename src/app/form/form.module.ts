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
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { StoDirectivesModule } from '@ngx-stoui/core';
import { MatCardModule } from '@angular/material/card';

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
    MatInputModule, MatCardModule,
  ],
  declarations: [ FormComponent ],
})
export class FormModule {
}
