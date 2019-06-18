import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StoMessagePanelComponent } from './sto-message-panel.component';


@NgModule({
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  exports: [StoMessagePanelComponent],
  declarations: [StoMessagePanelComponent]
})
export class StoMessagePanelModule {
}
