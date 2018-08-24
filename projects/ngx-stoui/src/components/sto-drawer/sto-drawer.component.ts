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

/**
 * A sidebar navigation commonly referred as a drawer that animates from the left or right side of the viewport.
 */
@Component({
  selector: 'sto-drawer',
  templateUrl: './sto-drawer.component.html',
  styleUrls: ['./sto-drawer.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class StoDrawerComponent implements OnInit, AfterViewInit {
  /**
   * Offset (space) between the viewPanel right and the drawer in pixels
   * Binds to the right style property.
   * Used for multiple drawers where the offset would be the widht of the allready opened drawer.
   * Default 0.
   */
  @Input() offset = '0';
  /**
  * Offset (space) between the viewPanel top and the drawer in pixels.
   * Binds to the top style property.
   * Default 0.
  */
  @Input() padding = '0px';
  /**
   * Position of the drawer as a string
   * Left or right. Default right.
   */
  @Input() position: 'left' | 'right';
  /**
   * Additional css class(es) as a string e.g 'sto-drawer--xmas'.
   */
  @Input() cssClass: string;
  /**
   * If the drawer should close when clicked outside the drawer.
   */
  @Input() closeOnClick: boolean;

  /**
   * Esc key closed by default the drawer, this overrides that behaviour.
   * Default false.
   */
  @Input() ignoreEscKey = false;

  /**
   * If the drawer is opened.
   */
  @Input() get open() {
    return this._open;
  }

  /**
   * The width of the drawer in as a string (pixels: '600px', presentage: '33%', or viewPort:'30vw')
   * Default '25vw'
   */
  @Input() @HostBinding('style.width') width = '25vw';
  /**
   * @deprecated Use selector sto-drawer-header instead
   */
  @Input() header: string;
  /**
   * @deprecated Use selector sto-drawer-header instead
   */
  @Input() headerIcon: string;

  /**
   * Emits true if opened, false if closed.
   * @type {EventEmitter<boolean>}
   */
  @Output() onToggle = new EventEmitter<boolean>();
  /**
   * Emits on close.
   */
  @Output() onClose = new EventEmitter();
  /**
   * Emits on open.
   */
  @Output() onOpen = new EventEmitter();

  /**
   * Emits on cancel. When the cancel is called by pressing ESC key.
   * @type {EventEmitter<any>}
   */
  @Output() cancel = new EventEmitter();
  /**
   * Emits on submit. When the submit is called from code like CTRL+S.
   * @type {EventEmitter<any>}
   */
  @Output() submit = new EventEmitter();

  @ViewChild('footer') footerRef: ElementRef;
  @ViewChild('header') headerRef: ElementRef;


  @HostBinding('style.display') display = 'block';

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey || event.altKey || event.shiftKey) {
      this.testKeyCombos(event);
    } else {
      this.testSingleKeys(event);
    }
  }

  public height = '100%';

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
    if (ev.keyCode !== Key.Escape || this.ignoreEscKey) {
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
  private isAnActiveOverlayPresent(): boolean {
    const overlays = Array.from(document.getElementsByClassName('cdk-overlay-container'))
      .filter(overlay => !!overlay)
      .filter(overlay => overlay.children.length > 0)
      .map(overlay => overlay.children)
      .reduce((a, b) => [...a, ...Array.from(b)], []);
    const overlaysActive = overlays
      .map(el => el.innerHTML)
      .filter(content => !!content || content !== '');
    return overlaysActive.length !== 0;
  }

  /**
   * Test if a keypress is inside a sto-daterange picker by the tagnamne
   * @param ev
   * @returns true if inside sto-daterange false if else
   */
  private isKeyPressInDaterangePicker(ev: KeyboardEvent): boolean {
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

    const pathArr = [element];

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
        const path = event.path || (event.composedPath && event.composedPath() || this.eventPathPolyfill(event.target));

        let doNothing = false;
        for (const el of path) {
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
  @HostBinding('class.sto-drawer__header') class = true;
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
