import { Component, EventEmitter, Input, NgModule, OnInit, Output, Renderer2, ViewEncapsulation, HostListener} from '@angular/core';
import { CommonModule } from '@angular/common';
import { animate, AnimationMetadata, state, style, transition, trigger } from '@angular/animations';
import { StoButtonModule } from '../sto-button/sto-button.directive';

@Component({
  selector: 'sto-drawer',
  templateUrl: './sto-drawer.component.html',
  styleUrls: ['./sto-drawer.component.scss'],
  encapsulation: ViewEncapsulation.None,
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

  @HostListener('document:keydown ', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.keyCode === 27) {
     // this.closeDrawer(true);
    }
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

  //Move to polyfill?
  private eventPathPolyfill = function (element) {

      var pathArr = [element];

      if (element === null || element.parentElement === null) {
        return [];
      }

      while (element.parentElement !== null) {
        element = element.parentElement;
        pathArr.unshift(element);
      }

      return pathArr;
    };


  private bindDocumentClickListener() {
    if (!this.documentClickListener) {
      this.documentClickListener = this.renderer.listen('document', 'click', (event) => {
        let path = event.path || (event.composedPath && event.composedPath() || this.eventPathPolyfill(event.target));

        let doNothing = false;
        for (let el of path) {
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
  selector: 'sto-drawer-header',
  template: `<ng-content></ng-content>`,
  styleUrls: ['./sto-drawer.component.scss']
})
export class StoDrawerHeaderComponent {
}

@Component({
  selector: 'sto-drawer-footer',
  template: `<div class="sto-drawer__footer"><ng-content></ng-content><div>`
})
export class StoDrawerFooterComponent {
}

@Component({
  selector: 'sto-drawer-wrapper',
  templateUrl: './sto-drawer-wrapper.component.html',
  styleUrls: ['./sto-drawer-wrapper.component.scss']
})
export class StoDrawerWrapperComponent {
}

@NgModule({
  imports: [CommonModule, StoButtonModule],
  exports: [StoDrawerComponent, StoDrawerWrapperComponent, StoDrawerFooterComponent, StoDrawerHeaderComponent],
  declarations: [StoDrawerComponent, StoDrawerWrapperComponent, StoDrawerFooterComponent, StoDrawerHeaderComponent]
})
export class StoDrawerModule {
}
