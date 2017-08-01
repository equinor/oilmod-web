import { Component, NgModule, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Panel } from '../../vendor/primeface/components/panel/panel';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'sto-panel',
  templateUrl: 'sto-panel.component.html',
  styleUrls: ['sto-panel.component.scss'],
  animations: [
    trigger('panelContent', [
      state('hidden', style({
        height: '0'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible <=> hidden', animate('400ms cubic-bezier(0.86, 0, 0.07, 1)'))
    ])
  ]
})
export class StoPanelComponent extends Panel {
  constructor(private el: ElementRef) {
    super(el);
  }
}

@NgModule({
  imports: [CommonModule],
  exports: [StoPanelComponent],
  declarations: [StoPanelComponent]
})
export class StoPanelModule {
}
