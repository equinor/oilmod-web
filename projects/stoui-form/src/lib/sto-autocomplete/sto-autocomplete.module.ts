import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoAutocompleteComponent } from './sto-autocomplete.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { StoDirectivesModule } from '@ngx-stoui/core';

@NgModule({
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    StoDirectivesModule
  ],
  declarations: [StoAutocompleteComponent],
  exports: [StoAutocompleteComponent]
})
export class StoAutocompleteModule { }
