import { Component, ElementRef, NgModule, Renderer } from '@angular/core';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { StoButtonModule } from '../sto-button/sto-button.component';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { SharedModule } from '../../vendor/primeface/components/common/shared';
import { ConfirmDialog } from '../../vendor/primeface/components/confirmdialog/confirmdialog';
import { ConfirmationService } from '../../vendor/primeface/components/common/api';
import { StoSharedModule } from 'ngx-stoui/components/sto-shared/sto-shared';

@Component({
  selector: 'sto-confirmDialog',
  templateUrl: './sto-confirmdialog.component.html',
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
export class StoConfirmDialog extends ConfirmDialog {
  constructor(public el: ElementRef, public domHandler: DomHandler,
              public renderer: Renderer, protected confirmationService: ConfirmationService) {
    super(el, domHandler, renderer, confirmationService);
  }
}

@NgModule({
  imports: [CommonModule, StoButtonModule],
  exports: [StoConfirmDialog, StoButtonModule, SharedModule, StoSharedModule],
  declarations: [StoConfirmDialog]
})
export class StoConfirmDialogModule {
}

