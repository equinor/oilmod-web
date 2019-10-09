import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoDatatableComponent } from './sto-datatable.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { StoDatatableBodyComponent } from './sto-datatable-body/sto-datatable-body.component';
import { ExecPipe } from './exec.pipe';
import { StoDatatableBodyRowComponent } from './sto-datatable-body/sto-datatable-body-row/sto-datatable-body-row.component';
import { StoDatatableHeaderGroupComponent } from './sto-datatable-header-group/sto-datatable-header-group.component';
import { StoDatatableHeaderComponent } from './sto-datatable-header/sto-datatable-header.component';
import { MatIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
    MatIconModule
  ],
  declarations: [
    StoDatatableComponent
    , StoDatatableBodyComponent
    , ExecPipe
    , StoDatatableBodyRowComponent, StoDatatableHeaderGroupComponent, StoDatatableHeaderComponent
  ],
  exports: [ StoDatatableComponent ],
})
export class StoDatatableModule {
}
