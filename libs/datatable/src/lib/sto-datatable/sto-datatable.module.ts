import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoDatatableComponent } from './sto-datatable.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { StoDatatableBodyComponent } from './sto-datatable-body/sto-datatable-body.component';
import { ExecPipe } from './exec.pipe';
import { StoDatatableBodyRowComponent } from './sto-datatable-body/sto-datatable-body-row/sto-datatable-body-row.component';
import { StoDatatableHeaderGroupComponent } from './sto-datatable-header-group/sto-datatable-header-group.component';
import { StoDatatableHeaderComponent } from './sto-datatable-header/sto-datatable-header.component';
import { MatIconModule } from '@angular/material/icon';
import { StoDatatableResizeDirective } from './sto-datatable-header/sto-datatable-resize.directive';
import { ColumnStylePipe } from './column-style.pipe';
import { MatRippleModule } from '@angular/material/core';
import {
  StoDatatableActionsComponent,
  StoDataTableActionsLeftComponent,
  StoDataTableActionsRightComponent
} from './sto-datatable-actions/sto-datatable-actions.component';
import { MatSortModule } from '@angular/material/sort';
import { GetGroupFlexPipe } from './get-group-flex.pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
    MatIconModule,
    MatRippleModule,
    MatSortModule,
    DragDropModule,
  ],
  declarations: [
    StoDatatableComponent
    , StoDatatableBodyComponent
    , ExecPipe
    , StoDatatableBodyRowComponent
    , StoDatatableHeaderGroupComponent
    , StoDatatableHeaderComponent
    , StoDatatableResizeDirective
    , ColumnStylePipe
    , StoDataTableActionsLeftComponent
    , StoDataTableActionsRightComponent
    , StoDatatableActionsComponent, GetGroupFlexPipe,
  ],
  exports: [ StoDatatableComponent, StoDataTableActionsLeftComponent, StoDataTableActionsRightComponent, StoDatatableActionsComponent, GetGroupFlexPipe ],
})
export class StoDatatableModule {
}
