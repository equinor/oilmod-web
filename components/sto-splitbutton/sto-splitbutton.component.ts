import { ChangeDetectorRef, Input, Component, ElementRef, NgModule, Renderer } from '@angular/core';
import { SplitButton } from '../../vendor/primeface/components/splitbutton/splitbutton';
import { Router, RouterModule } from '@angular/router';
import { DomHandler } from '../../vendor/primeface/components/dom/domhandler';
import { CommonModule } from '@angular/common';
import { StoButtonModule } from '../sto-button/sto-button.directive';

@Component({
  selector: 'sto-splitButton',
  templateUrl: './sto-splitbutton.component.html',
  styleUrls: ['./sto-splitbutton.component.scss'],
  providers: [DomHandler]
})
export class StoSplitbuttonComponent extends SplitButton {

  @Input() dropDown = true;

  onDefaultButtonClick(event: Event, menu?: HTMLDivElement, container?: Element) {
    if (!this.dropDown) {
      this.onClick.emit(event);
    } else {
      event.preventDefault();
      this.onDropdownClick(event, menu, container);
    }
  }

  constructor(public el: ElementRef, public domHandler: DomHandler, public renderer: Renderer, public router: Router, public cd: ChangeDetectorRef) {
    super(el, domHandler, renderer, router, cd);
  }

}

@NgModule({
  imports: [CommonModule, RouterModule, StoButtonModule],
  exports: [StoSplitbuttonComponent],
  declarations: [StoSplitbuttonComponent]
})
export class StoSplitbuttonModule {}