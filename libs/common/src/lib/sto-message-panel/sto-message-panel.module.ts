import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { StoMessagePanelComponent } from './sto-message-panel.component';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  imports: [ CommonModule, MatIconModule, MatTooltipModule, MatButtonModule ],
  exports: [StoMessagePanelComponent],
  declarations: [StoMessagePanelComponent]
})
export class StoMessagePanelModule {
}
