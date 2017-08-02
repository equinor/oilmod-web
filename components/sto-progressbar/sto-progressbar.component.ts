import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressBar } from '../../vendor/primeface/components/progressbar/progressbar';

@Component({
  selector: 'sto-progressBar',
  templateUrl: './sto-progressbar.component.html'
})
export class StoProgressBar extends ProgressBar {
}

@NgModule({
  imports: [CommonModule],
  exports: [StoProgressBar],
  declarations: [StoProgressBar]
})
export class StoProgressBarModule {
}