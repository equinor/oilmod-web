import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule, MatIconModule, MatButtonModule, MatButtonToggleModule } from '@angular/material';
import { StoActionFooterComponent } from './sto-action-footer.component';

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, MatButtonToggleModule],
  exports: [StoActionFooterComponent],
  declarations: [StoActionFooterComponent]
})
export class StoActionFooterModule {
}
