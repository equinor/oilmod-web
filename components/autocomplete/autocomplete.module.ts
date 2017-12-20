import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoAutocompleteComponent } from './autocomplete.component';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  declarations: [StoAutocompleteComponent],
  exports: [StoAutocompleteComponent]
})
export class StoAutocompleteModule { }
