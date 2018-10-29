import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonRoutingModule } from './common-routing.module';
import { CommonComponent } from './common.component';
import {
  MatButtonModule,
  MatCardModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatTabsModule
} from '@angular/material';
import { ConfirmModule, StoActionFooterModule, StoFilterPanelModule, StoMessagePanelModule } from '@ngx-stoui/common';
import { FilterComponent } from './filter/filter.component';

@NgModule({
  imports: [
    CommonModule,
    CommonRoutingModule,
    MatButtonModule,
    MatCardModule,
    StoActionFooterModule,
    StoFilterPanelModule,
    StoMessagePanelModule,
    ConfirmModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabsModule,
    MatExpansionModule
  ],
  declarations: [CommonComponent, FilterComponent]
})
export class DemoCommonModule { }
