import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import {
  StoFilterActions,
  StoFilterActionsBar,
  StoFilterPanelComponent,
  StoFilterTableActions,
  StoFilterTitle
} from './sto-filter-panel.component';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';

@NgModule({
  imports: [ CommonModule, MatExpansionModule, MatIconModule, MatButtonModule, MatButtonToggleModule, MatTooltipModule, MatChipsModule ],
  exports: [ StoFilterPanelComponent, StoFilterTitle, StoFilterActions, StoFilterTableActions ],
  declarations: [ StoFilterPanelComponent, StoFilterTitle, StoFilterActions, StoFilterActionsBar, StoFilterTableActions ]
})
export class StoFilterPanelModule {
}
