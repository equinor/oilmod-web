/* eslint-disable @angular-eslint/no-output-native,@angular-eslint/no-output-on-prefix */
import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
  input,
  output,
} from '@angular/core';
import { Key } from '@ngx-stoui/core';
import { drawerAnimations } from '../animation';
import { StoDrawerFooterComponent } from './sto-drawer-footer.component';
import { StoDrawerHeaderComponent } from './sto-drawer-header.component';

/**
 * A sidebar navigation commonly referred as a drawer that animates from the left or right side of the viewport.
 */
@Component({
  selector: 'sto-drawer',
  templateUrl: './sto-drawer.component.html',
  styleUrls: ['./sto-drawer.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: drawerAnimations,
  imports: [NgClass],
})
export class StoDrawerComponent implements OnInit, AfterViewInit {
  private el = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);

  /**
   * Offset (space) between the viewPanel right and the drawer in pixels
   * Binds to the right style property.
   * Used for multiple drawers where the offset would be the widht of the allready opened drawer.
   * Default 0.
   */
  readonly offset = input('0');
  /**
   * Offset (space) between the viewPanel top and the drawer in pixels.
   * Binds to the top style property.
   * Default 0.
   */
  readonly padding = input('0px');
  /**
   * Position of the drawer as a string
   * Left or right. Default right.
   */
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input() position: 'left' | 'right';
  /**
   * Additional css class(es) as a string e.g 'sto-drawer--xmas'.
   */
  readonly cssClass = input<string>();
  /**
   * If the drawer should close when clicked outside the drawer.
   */
  readonly closeOnClick = input<boolean>();
  /**
   * Esc key closed by default the drawer, this overrides that behaviour.
   * Default false.
   */
  readonly ignoreEscKey = input(false);
  /**
   * The width of the drawer in as a string (pixels: '600px', presentage: '33%', or viewPort:'30vw')
   * Default '25vw'
   */
  // TODO: Skipped for migration because:
  //  This input is used in combination with `@HostBinding` and migrating would
  //  break.
  @Input()
  @HostBinding('style.width')
  width = '300px';
  // I don't see what harm this can do, the drawer should always be full height..
  @HostBinding('style.height.vh')
  h = 100;
  readonly animation = input<boolean>();
  readonly backdrop = input<boolean>();
  /**
   * Emits true if opened, false if closed.
   *  {EventEmitter<boolean>}
   */
  readonly onToggle = output<boolean>();
  /**
   * Emits on close.
   */
  readonly onClose = output<boolean>();
  /**
   * Emits on open.
   */
  readonly onOpen = output<boolean>();
  /**
   * Emits on cancel. When the cancel is called by pressing ESC key.
   *  {EventEmitter<any>}
   */
  readonly cancel = output();
  /**
   * Emits on submit. When the submit is called from code like CTRL+S.
   *  {EventEmitter<any>}
   */
  readonly submit = output();
  public height = '100%';
  @ViewChild('header') headerRef: ElementRef;
  @ContentChild(StoDrawerFooterComponent, { read: ElementRef })
  footer: ElementRef<HTMLElement>;
  @ContentChild(StoDrawerHeaderComponent, { read: ElementRef })
  headerChild: ElementRef<HTMLElement>;

  // @HostBinding('@drawerAnimations')
  get slideInOut() {
    if (!this.animation()) {
      return this.open ? 'openImmediate' : `closedImmediate-${this.position}`;
    }
    return this.open ? `open-${this.position}` : `closed-${this.position}`;
  }

  private _open: boolean;

  /**
   * If the drawer is opened.
   */
  // TODO: Skipped for migration because:
  //  Accessor inputs cannot be migrated as they are too complex.
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

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.ctrlKey || event.altKey || event.shiftKey) {
      this.testKeyCombos(event);
    } else {
      this.testSingleKeys(event);
    }
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    this.resizeContent();
  }

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
    this.cdr.detectChanges();
    if (emit) {
      this.onClose.emit(true);
    }
  }

  public openDrawer(emit = true) {
    this.open = true;
    if (emit) {
      this.onOpen.emit(true);
    }
  }

  ngOnInit() {
    if (!this.position) {
      this.position = 'left';
    }
  }

  ngAfterViewInit() {
    setTimeout(() => this.resizeContent());
  }

  private testKeyCombos(ev: KeyboardEvent) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const path: HTMLElement[] = (ev as any).path;
    // Test to ensure we have focus inside the drawer
    if (!(path && path.includes(this.el.nativeElement))) {
      return;
    }
    if (ev.ctrlKey && ev.keyCode === Key.Enter) {
      this.submit.emit();
    }
  }

  private testSingleKeys(ev: KeyboardEvent) {
    if (ev.keyCode !== Key.Escape || this.ignoreEscKey()) {
      return;
    }
    const isNotInsideAMenu = !this.isAnActiveOverlayPresent();
    if (isNotInsideAMenu) {
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
    const overlays: Array<Element> = Array.from(
      document.getElementsByClassName('cdk-overlay-container'),
    )
      .filter((overlay) => !!overlay)
      .filter((overlay) => overlay.children.length > 0)
      .map((overlay) => Array.from(overlay.children))
      .flat();
    const overlaysActive = overlays
      .map((el) => el.innerHTML)
      .filter((content) => !!content || content !== '');
    return overlaysActive.length !== 0;
  }

  private resizeContent() {
    if (this.open) {
      const hasFooter = this.footer;
      const totalHeight: number = this.el?.nativeElement.offsetHeight;
      let footerHeight = 0;

      const headerHeight = this.headerRef?.nativeElement.offsetHeight;
      if (hasFooter) {
        footerHeight = this.footer?.nativeElement.offsetHeight;
      }
      this.height = `${totalHeight - footerHeight - headerHeight}px`;
    }
  }
}
