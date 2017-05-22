import { Component, ElementRef, NgModule, Renderer } from '@angular/core';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { ButtonModule } from '../../vendor/primeface/components/button/button';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Dialog } from '../../vendor/primeface/components/dialog/dialog';
import { SharedModule } from '../../vendor/primeface/components/common/shared';
import { StoSharedModule } from '../sto-shared/sto-shared';

@Component({
  selector: 'sto-dialog',
  templateUrl: './sto-dialog.component.html',
  styleUrls: ['./sto-dialog.component.scss'],
  animations: [
    trigger('dialogState', [
      state('hidden', style({
        opacity: 0
      })),
      state('visible', style({
        opacity: 1
      })),
      transition('visible => hidden', animate('400ms ease-in')),
      transition('hidden => visible', animate('400ms ease-out'))
    ])
  ],
  providers: [DomHandler]
})
export class StoDialogComponent extends Dialog {

  constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer) {
    super(el, domHandler, renderer);
  }
}

@NgModule({
  imports: [CommonModule],
  exports: [StoDialogComponent, SharedModule, StoSharedModule],
  declarations: [StoDialogComponent]
})
export class StoDialogModule {
}


