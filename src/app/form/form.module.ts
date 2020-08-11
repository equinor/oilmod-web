import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormRoutingModule } from './form-routing.module';
import { FormComponent } from './form.component';
import { NumberInputModule, StoAutocompleteModule, StoDatepickerModule, StoFormModule, StoSelectFilterModule, } from '@ngx-stoui/form';
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
    NumberInputModule,
    ReactiveFormsModule,
    StoAutocompleteModule, StoDatepickerModule, StoSelectFilterModule,
    MatSelectModule,
    StoDirectivesModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule, MatCardModule, StoFormModule,
  ],
  declarations: [ FormComponent ],
})
export class FormModule {
}
