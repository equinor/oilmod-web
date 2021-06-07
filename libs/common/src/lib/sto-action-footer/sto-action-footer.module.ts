import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { StoActionFooterComponent } from './sto-action-footer.component';

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule, MatButtonToggleModule, MatProgressBarModule],
  exports: [StoActionFooterComponent],
  declarations: [StoActionFooterComponent]
})
export class StoActionFooterModule {
}
