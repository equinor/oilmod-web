import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  StoFilterActions,
  StoFilterActionsBar,
  StoFilterPanelComponent,
  StoFilterTableActions,
  StoFilterTitle
} from './sto-filter-panel.component';

@NgModule({
  imports: [CommonModule, MatExpansionModule, MatIconModule, MatButtonModule, MatButtonToggleModule, MatTooltipModule],
  exports: [StoFilterPanelComponent, StoFilterTitle, StoFilterActions, StoFilterTableActions],
  declarations: [StoFilterPanelComponent, StoFilterTitle, StoFilterActions, StoFilterActionsBar, StoFilterTableActions]
})
export class StoFilterPanelModule {
}
