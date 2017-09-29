import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdExpansionModule, MdIconModule } from '@angular/material';
import { StoFilterPanelComponent, StoFilterTitle, StoFilterActions,StoFilterTableActions, StoFilterActionsBar } from './sto-filter-panel.component'

@NgModule({
  imports: [CommonModule, MdExpansionModule, MdIconModule],
  exports: [StoFilterPanelComponent, StoFilterTitle, StoFilterActions,StoFilterTableActions],
  declarations: [StoFilterPanelComponent, StoFilterTitle, StoFilterActions, StoFilterActionsBar,StoFilterTableActions]
})
export class StoFilterPanelModule {
}
