import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoSelectFilterComponent } from './sto-select-filter.component';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule, MatIconModule, MatCheckboxModule,
    FormsModule, ReactiveFormsModule
  ],
  declarations: [ StoSelectFilterComponent ],
  exports: [ StoSelectFilterComponent ],
})
export class StoSelectFilterModule {
}
