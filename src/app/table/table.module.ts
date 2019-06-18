import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableRoutingModule } from './table-routing.module';
import { TableComponent } from './table.component';
import { NgxDatatableModule, StoDatatableModule } from '@ngx-stoui/datatable';
import { MatCardModule } from '@angular/material/card';
import { StoFilterPanelModule } from '@ngx-stoui/common';

@NgModule({
  imports: [
    CommonModule,
    TableRoutingModule,
    StoDatatableModule,
    NgxDatatableModule,
    MatCardModule,
    StoFilterPanelModule,
  ],
  declarations: [ TableComponent ]
})
export class TableModule {
}
