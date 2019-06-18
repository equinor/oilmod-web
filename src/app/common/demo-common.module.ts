import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonRoutingModule } from './common-routing.module';
import { CommonComponent } from './common.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
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
  declarations: [CommonComponent, FilterComponent],
  entryComponents: []
})
export class DemoCommonModule { }
