import { Component, EventEmitter, Input, NgModule, OnInit, Output, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger, AnimationMetadata } from '@angular/animations';
import { StoButtonModule } from '../sto-button/sto-button.directive';

@Component({
  selector: 'sto-drawer',
  templateUrl: './sto-drawer.component.html',
  styleUrls: ['./sto-drawer.component.scss'],
  animations: [
    trigger('slideInOut', [
        state('in', style({
          transform: 'translate3d(0%, 0, 0)',
          visibility: 'visible',
        })),
        state('outleft', style({
          transform: 'translate3d(-100%, 0, 0)',
          visibility: 'hidden',
        })),
        state('outright', style({
          transform: 'translate3d(100%, 0, 0)',
          visibility: 'hidden',
        })),
        transition('in <=> *', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
      ]
    )
  ]
})
export class StoDrawerComponent implements OnInit {
  @Input() header: string;
  @Input() headerIcon: string;
  @Input() width = '25vw';
  @Input() offset: string = '0';
  @Input() padding = '0px';
  @Input() position: 'left' | 'right';
  @Input() closeOnClick: boolean;


  @Output() onToggle = new EventEmitter<boolean>();
  @Output() onClose = new EventEmitter();
  @Output() onOpen = new EventEmitter();

  @Input()
  get open() {
    return this._open;
  }

  set open(open: boolean) {
    this._open = open;
    if (this.closeOnClick) {
      setTimeout(() => {
        if (open) {
          this.bindDocumentClickListener();
        } else if (this.documentClickListener) {
          this.documentClickListener();
          this.documentClickListener = null;
        }
      });
    }
  }

  private _open;

  public toggle(emit = true) {
    if (emit) {
      this.onToggle.emit(!this.open);
    }
    if (!this.open) {
      this.openDrawer(emit);
    } else {
      this.closeDrawer(emit);
    }
  }

  public closeDrawer(emit = true) {
    this.open = false;
    if (emit) {
      this.onClose.emit();
    }
  }

  public openDrawer(emit = true) {
    this.open = true;
    if (emit) {
      this.onOpen.emit();
    }
  }

  private documentClickListener;

  public style = {
    [this.position]: this.open ? 0 : `-${this.width}`
  };

  private bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = this.renderer.listen('document', 'click', (event) => {
        let doNothing = false;
        for (let el of event.path) {
          if (el.tagName && el.tagName.toLowerCase().match(/drawer$/i)) {
            doNothing = true;
            break;
          }
        }
        if (!doNothing && this.open) {
          this.closeDrawer();
        }
      });
    }
  }

  constructor(private renderer: Renderer2) {
  }

  ngOnInit() {
    if (!this.position) {
      this.position = 'left';
    }
  }
}

@Component({
  selector: 'sto-drawer-wrapper',
  templateUrl: './sto-drawer-wrapper.component.html',
  styleUrls: ['./sto-drawer-wrapper.component.scss']
})
export class StoDrawerWrapperComponent {}

@NgModule({
  imports: [CommonModule, StoButtonModule],
  exports: [StoDrawerComponent, StoDrawerWrapperComponent],
  declarations: [StoDrawerComponent, StoDrawerWrapperComponent]
})
export class StoDrawerModule {}
