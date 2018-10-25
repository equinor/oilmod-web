import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoSelectFilterComponent } from './sto-select-filter.component';
import { MatInputModule, MatIconModule, MatCheckboxModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule, MatIconModule, MatCheckboxModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [StoSelectFilterComponent],
  exports: [StoSelectFilterComponent],
})
export class StoSelectFilterModule { }
