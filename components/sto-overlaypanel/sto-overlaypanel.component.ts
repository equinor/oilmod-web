// OverlayPanelModule
import { Component, NgModule, Renderer, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanel } from '../../vendor/primeface/components/overlaypanel/overlaypanel';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'sto-overlaypanel',
  templateUrl: 'sto-overlaypanel.component.html',
  styleUrls: ['sto-overlaypanel.component.scss'],
  providers: [DomHandler]
})
export class StoOverlayPanelComponent extends OverlayPanel {
  constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer) {
    super(el, domHandler, renderer);
  }

}

@NgModule({
  imports: [CommonModule],
  exports: [StoOverlayPanelComponent],
  declarations: [StoOverlayPanelComponent]
})
export class StoOverlayPanelModule {
}
