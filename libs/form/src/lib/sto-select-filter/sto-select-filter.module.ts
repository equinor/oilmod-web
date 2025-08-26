import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoSelectFilterComponent } from './sto-select-filter.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@NgModule({
    imports: [
        CommonModule,
        MatInputModule, MatIconModule, MatCheckboxModule,
        FormsModule, ReactiveFormsModule,
        StoSelectFilterComponent
    ],
    exports: [StoSelectFilterComponent],
})
export class StoSelectFilterModule {
}
