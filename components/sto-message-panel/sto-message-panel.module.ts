import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule, MatIconModule, MatTooltipModule } from '@angular/material';
import { StoMessagePanelComponent } from './sto-message-panel.component';


@NgModule({
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  exports: [StoMessagePanelComponent],
  declarations: [StoMessagePanelComponent]
})
export class StoMessagePanelModule {
}
