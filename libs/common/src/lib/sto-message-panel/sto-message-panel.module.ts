import { StoMessagePanelComponent } from './sto-message-panel.component';

/**
 * @deprecated StoMessagePanelComponent has been made standalone
 */
import { NgModule } from '@angular/core';

@NgModule({
  imports: [ StoMessagePanelComponent ],
  exports: [ StoMessagePanelComponent ]
})
export class StoMessagePanelModule {
}
