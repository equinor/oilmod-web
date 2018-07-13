import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoAutocompleteComponent } from './sto-autocomplete.component';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { StoDirectivesModule } from '../directives/directives.module';

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
