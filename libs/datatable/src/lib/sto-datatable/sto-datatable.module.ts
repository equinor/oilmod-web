import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { ColumnStylePipe } from './column-style.pipe';
import { ExecPipe } from './exec.pipe';
import { GetGroupFlexPipe } from './get-group-flex.pipe';
import {
  StoDatatableActionsComponent,
  StoDataTableActionsLeftComponent,
  StoDataTableActionsRightComponent,
} from './sto-datatable-actions/sto-datatable-actions.component';
import { StoDatatableBodyRowComponent } from './sto-datatable-body/sto-datatable-body-row/sto-datatable-body-row.component';
import { StoDatatableBodyComponent } from './sto-datatable-body/sto-datatable-body.component';
import { StoDatatableHeaderGroupComponent } from './sto-datatable-header-group/sto-datatable-header-group.component';
import { StoDatatableHeaderComponent } from './sto-datatable-header/sto-datatable-header.component';
import { StoDatatableResizeDirective } from './sto-datatable-header/sto-datatable-resize.directive';
import { StoDatatableComponent } from './sto-datatable.component';

@NgModule({
    imports: [
        CommonModule,
        ScrollingModule,
        MatIconModule,
        MatRippleModule,
        MatSortModule,
        DragDropModule,
        StoDatatableComponent,
        StoDatatableBodyComponent,
        ExecPipe,
        StoDatatableBodyRowComponent,
        StoDatatableHeaderGroupComponent,
        StoDatatableHeaderComponent,
        StoDatatableResizeDirective,
        ColumnStylePipe,
        StoDataTableActionsLeftComponent,
        StoDataTableActionsRightComponent,
        StoDatatableActionsComponent,
        GetGroupFlexPipe,
    ],
    exports: [
        StoDatatableComponent,
        StoDataTableActionsLeftComponent,
        StoDataTableActionsRightComponent,
        StoDatatableActionsComponent,
        GetGroupFlexPipe,
    ],
})
export class StoDatatableModule {}
