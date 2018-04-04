import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectFilterComponent } from './mat-select-filter.component';
import { MatInputModule, MatIconModule, MatCheckboxModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule, MatIconModule, MatCheckboxModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [MatSelectFilterComponent],
  exports: [MatSelectFilterComponent],
})
export class MatSelectFilterModule { }
