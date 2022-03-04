/* eslint-disable @angular-eslint/no-output-native,@angular-eslint/no-output-on-prefix */
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
import { StoDrawerFooterComponent } from './sto-drawer-footer.component';
import { drawerAnimations } from '../animation';
import { StoDrawerHeaderComponent } from './sto-drawer-header.component';

/**
 * A sidebar navigation commonly referred as a drawer that animates from the left or right side of the viewport.
 */
@Component({
  selector: 'sto-drawer',
  templateUrl: './sto-drawer.component.html',
  styleUrls: [ './sto-drawer.component.scss', '../sto-navigation/_sto-navigation.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: drawerAnimations
})

export class StoDrawerComponent implements OnInit, AfterViewInit {

  /**
   * If the drawer is opened.
   */
  @Input()
  @HostBinding('class.open')
  get open(): boolean {
    return this._open;
  }

  set open(open: boolean) {
    this._open = open;
    this.onOpen.emit(open);
    this.cdr.detectChanges();
  }

  // @HostBinding('@drawerAnimations')
  get slideInOut() {
    if ( !this.animation ) {
      return this.open ? 'openImmediate' : `closedImmediate-${this.position}`;
    }
    return this.open ? `open-${this.position}` : `closed-${this.position}`;
  }

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

  private _open: boolean;

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
  @ContentChild(StoDrawerHeaderComponent, { read: ElementRef })
  headerChild: ElementRef<HTMLElement>;

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {
  }


  @HostListener('document:keydown', [ '$event' ])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ( event.ctrlKey || event.altKey || event.shiftKey ) {
      this.testKeyCombos(event);
    } else {
      this.testSingleKeys(event);
    }
  }


  private testKeyCombos(ev: KeyboardEvent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const path: HTMLElement[] = ( ev as any ).path;
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
    const isNotInsideAMenu = !this.isAnActiveOverlayPresent();
    if ( isNotInsideAMenu ) {
      this.closeDrawer();
      this.cancel.emit();
    }
  }

  /**
   * Test if an active overlay is active by checkout for cdk-overlay-containeres that are active.
   * This indicates a select-list, dialog or menu is opened.
   * true if an active overlay is present in the DOM.
   */
  private isAnActiveOverlayPresent(): boolean {
    const overlays: Array<Element> = Array.from(document.getElementsByClassName('cdk-overlay-container'))
      .filter(overlay => !!overlay)
      .filter(overlay => overlay.children.length > 0)
      .map(overlay => Array.from(overlay.children))
      .flat();
    const overlaysActive = overlays
      .map(el => el.innerHTML)
      .filter(content => !!content || content !== '');
    return overlaysActive.length !== 0;
  }

  @HostListener('window:resize', [ '$event' ])
  onWindowResize() {
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

  ngOnInit() {
    if ( !this.position ) {
      this.position = 'left';
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.resizeContent());
  }
}
