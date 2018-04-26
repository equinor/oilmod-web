import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  NgModule,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Key } from '../shared/abstract-and-interfaces/keyPress.enum';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'sto-drawer',
  templateUrl: './sto-drawer.component.html',
  styleUrls: ['./sto-drawer.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class StoDrawerComponent implements OnInit, AfterViewInit {
  @Input() header: string;
  @Input() headerIcon: string;
  @HostBinding('style.display') display = 'block';
  @HostBinding('style.width') @Input() width = '25vw';
  @Input() offset: string = '0';
  @Input() padding = '0px';
  @Input() position: 'left' | 'right';
  @Input() cssClass: string;
  @Input() closeOnClick: boolean;
  @ViewChild('footer') footerRef: ElementRef;
  @ViewChild('header') headerRef: ElementRef;
  @Input() closeFunction: any;
  public height = '100%';

  @Output() onToggle = new EventEmitter<boolean>();
  @Output() onClose = new EventEmitter();
  @Output() onOpen = new EventEmitter();
  @Output() onOpened = new EventEmitter();
  @Output() afterClosed = new EventEmitter();
  @Output() afterOpened = new EventEmitter();

  @Output() cancel = new EventEmitter();
  @Output() submit = new EventEmitter();

  @Input() ignoreEscKey = false;

  @Input()
  get open() {
    return this._open;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey || event.altKey || event.shiftKey) {
      this.testKeyCombos(event);
    } else {
      this.testSingleKeys(event);
    }
  }

  private testKeyCombos(ev: KeyboardEvent) {
    const path: HTMLElement[] = event['path'];
    // Test to ensure we have focus inside the drawer
    if (!(path && path.includes(this.el.nativeElement))) {
      return;
    }
    if (ev.ctrlKey && ev.keyCode === Key.Enter) {
      this.submit.emit();
    }
  }

  private testSingleKeys(ev: KeyboardEvent) {
    if(ev.keyCode !== Key.Escape || this.ignoreEscKey){
        return;
    }
    const isNotInsideADatePicker = !this.isKeyPressInDaterangePicker(ev);
    if (isNotInsideADatePicker) {
      const isNotInsideAMenu = !this.isAnActiveOverlayPresent();
      if (isNotInsideAMenu) {
        this.closeDrawer();
        this.cancel.emit();
      }
    }
  }

  /**
   * Test if an active overlay is active by checkout for cdk-overlay-containeres that are active.
   * This indicates a select-list, dialog or menu is opened.
   * @returns true if an active overlay is present in the DOM.
   */
  private isAnActiveOverlayPresent() : boolean{
    const overlays = Array.from(document.getElementsByClassName('cdk-overlay-container'))
      .filter(overlay => !!overlay)
      .filter(overlay => overlay.children.length > 0)
      .map(overlay => overlay.children)
      .reduce((a, b) => [...a, ...Array.from(b)], []);
    const overlaysActive = overlays
      .map(el => el.innerHTML)
      .filter(content => !!content || content !== '');
    return overlaysActive.length !== 0
  }

  /**
   * Test if a keypress is inside a sto-daterange picker by the tagnamne
   * @param ev
   * @returns true if inside sto-daterange false if else
   */
  private isKeyPressInDaterangePicker(ev: KeyboardEvent) : boolean{
    const path: Array<HTMLElement> = ev['path'];
    return !!path
      .filter(el => !!el.tagName)
      .map(el => el.tagName.toLowerCase())
      .find(tagname => tagname === 'sto-daterange');
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(e) {
    this.resizeContent();
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

  private resizeContent() {

    const hasFooter = this.footerRef.nativeElement.children.length > 0;
    const totalHeight: number = this.el.nativeElement.firstElementChild.offsetHeight;
    let footerHeight = 0;

    const headerHeight = this.headerRef.nativeElement.offsetHeight;
    if (hasFooter) {
      footerHeight = this.footerRef.nativeElement.offsetHeight;
    } else {
      this.footerRef.nativeElement.style = 'display: none';
    }
    this.height = `${totalHeight - footerHeight - headerHeight}px`;
  }

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit() {
    if (!this.position) {
      this.position = 'left';
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.resizeContent());
  }
}

@Component({
  selector: 'sto-drawer-header',
  template: `
	  <ng-content></ng-content>`,
  styleUrls: ['./sto-drawer.component.scss']
})
export class StoDrawerHeaderComponent {
  @HostBinding('class.sto-drawer__header') class: boolean = true;
}

@Component({
  selector: 'sto-drawer-footer',
  template: `
	  <ng-content></ng-content>`
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
  imports: [CommonModule, RouterModule],
  exports: [StoDrawerComponent, StoDrawerWrapperComponent, StoDrawerFooterComponent, StoDrawerHeaderComponent],
  declarations: [StoDrawerComponent, StoDrawerWrapperComponent, StoDrawerFooterComponent, StoDrawerHeaderComponent]
})
export class StoDrawerModule {
}
