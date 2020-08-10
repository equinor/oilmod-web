import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { Key } from '@ngx-stoui/core';
import { animate, group, state, style, transition, trigger } from '@angular/animations';
import { StoDrawerFooterComponent } from './sto-drawer-footer.component';

/**
 * A sidebar navigation commonly referred as a drawer that animates from the left or right side of the viewport.
 */
@Component({
  selector: 'sto-drawer',
  templateUrl: './sto-drawer.component.html',
  styleUrls: [ './sto-drawer.component.scss', '../sto-navigation/_sto-navigation.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('drawerAnimations', [
      state('open', style({ transform: 'translateX(0)', opacity: 1 })),
      state('openImmediate', style({ transform: 'translateX(0)', opacity: 1 })),
      state('closedImmediate', style({ transform: 'translateX(-100%)', opacity: 0 })),
      state('closed', style({ transform: 'translateX(-100%)', opacity: 0 })),
      transition('* => closed', [
        group([
          animate('400ms ease-in-out', style({ transform: 'translateX(-100%)' })),
          animate('1ms 400ms ease', style({ opacity: 0 }))
        ])
      ]),
      transition('* => open', [
        style({ transform: 'translateX(-100%)', opacity: 1 }),
        animate('400ms ease-in-out')
      ]),
    ]),
    trigger('overlay', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('400ms', style({ opacity: 0.08 })),
      ]),
      transition(':leave', [
        animate('400ms', style({ opacity: 0 }))
      ])
    ])
  ]
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
  @Input()
  @HostBinding('class.open')
  get open() {
    return this._open;
  }

  set open(open: boolean) {
    this._open = open;
    this.onOpen.emit(open);
    this.cdr.detectChanges();
  }

  private _open;

  /**
   * The width of the drawer in as a string (pixels: '600px', presentage: '33%', or viewPort:'30vw')
   * Default '25vw'
   */
  @Input() @HostBinding('style.width')
  width = '300px';

  // I don't see what harm this can do, the drawer should always be full height..
  @HostBinding('style.height.vh')
  h = 100;

  @Input()
  animation: boolean;
  @Input()
  backdrop: boolean;

  // @HostBinding('@drawerAnimations')
  get slideInOut() {
    if ( !this.animation ) {
      return this.open ? 'openImmediate' : 'closedImmediate';
    }
    return this.open ? 'open' : 'closed';
  }

  /**
   * Emits true if opened, false if closed.
   *  {EventEmitter<boolean>}
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
   *  {EventEmitter<any>}
   */
  @Output() cancel = new EventEmitter();
  /**
   * Emits on submit. When the submit is called from code like CTRL+S.
   *  {EventEmitter<any>}
   */
  @Output() submit = new EventEmitter();

  public height = '100%';

  @ViewChild('header') headerRef: ElementRef;
  @ContentChild(StoDrawerFooterComponent, { read: ElementRef })
  footer: ElementRef<HTMLElement>;


  @HostListener('document:keydown', [ '$event' ])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ( event.ctrlKey || event.altKey || event.shiftKey ) {
      this.testKeyCombos(event);
    } else {
      this.testSingleKeys(event);
    }
  }


  private testKeyCombos(ev: KeyboardEvent) {
    const path: HTMLElement[] = event[ 'path' ];
    // Test to ensure we have focus inside the drawer
    if ( !( path && path.includes(this.el.nativeElement) ) ) {
      return;
    }
    if ( ev.ctrlKey && ev.keyCode === Key.Enter ) {
      this.submit.emit();
    }
  }

  private testSingleKeys(ev: KeyboardEvent) {
    if ( ev.keyCode !== Key.Escape || this.ignoreEscKey ) {
      return;
    }
    const isNotInsideADatePicker = !this.isKeyPressInDaterangePicker(ev);
    if ( isNotInsideADatePicker ) {
      const isNotInsideAMenu = !this.isAnActiveOverlayPresent();
      if ( isNotInsideAMenu ) {
        this.closeDrawer();
        this.cancel.emit();
      }
    }
  }

  /**
   * Test if an active overlay is active by checkout for cdk-overlay-containeres that are active.
   * This indicates a select-list, dialog or menu is opened.
   * true if an active overlay is present in the DOM.
   */
  private isAnActiveOverlayPresent(): boolean {
    const overlays = Array.from(document.getElementsByClassName('cdk-overlay-container'))
      .filter(overlay => !!overlay)
      .filter(overlay => overlay.children.length > 0)
      .map(overlay => overlay.children)
      .reduce((a, b) => [ ...a, ...Array.from(b) ], []);
    const overlaysActive = overlays
      .map(el => el.innerHTML)
      .filter(content => !!content || content !== '');
    return overlaysActive.length !== 0;
  }

  /**
   * Test if a keypress is inside a sto-daterange picker by the tagnamne
   * @param ev
   * true if inside sto-daterange false if else
   */
  private isKeyPressInDaterangePicker(ev: KeyboardEvent): boolean {
    const path: Array<HTMLElement> = ev[ 'path' ];
    return !!path
      .filter(el => !!el.tagName)
      .map(el => el.tagName.toLowerCase())
      .find(tagname => tagname === 'sto-daterange');
  }

  @HostListener('window:resize', [ '$event' ])
  onWindowResize(e) {
    this.resizeContent();
  }


  public toggle(emit = true) {
    if ( emit ) {
      this.onToggle.emit(!this.open);
    }
    if ( !this.open ) {
      this.openDrawer(emit);
    } else {
      this.closeDrawer(emit);
    }
  }

  public closeDrawer(emit = true) {
    this.open = false;
    this.cdr.detectChanges();
    if ( emit ) {
      this.onClose.emit();
    }
  }

  public openDrawer(emit = true) {
    this.open = true;
    if ( emit ) {
      this.onOpen.emit();
    }
  }

  private resizeContent() {
    if ( this.open ) {
      const hasFooter = this.footer;
      const totalHeight: number = this.el?.nativeElement.offsetHeight;
      let footerHeight = 0;

      const headerHeight = this.headerRef?.nativeElement.offsetHeight;
      if ( hasFooter ) {
        footerHeight = this.footer?.nativeElement.offsetHeight;
      }
      this.height = `${totalHeight - footerHeight - headerHeight}px`;
    }
  }

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    if ( !this.position ) {
      this.position = 'left';
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.resizeContent());
  }
}
