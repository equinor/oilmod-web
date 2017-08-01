import { Component, NgModule, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIChart } from '../../vendor/primeface/components/chart/chart';

@Component({
  selector: 'sto-chart',
  templateUrl: 'sto-chart.component.html'
})
export class StoChartComponent extends UIChart {
  constructor(public el: ElementRef) {
    super(el);
  }
}

@NgModule({
  imports: [CommonModule],
  exports: [StoChartComponent],
  declarations: [StoChartComponent]
})
export class StoChartModule {
}
