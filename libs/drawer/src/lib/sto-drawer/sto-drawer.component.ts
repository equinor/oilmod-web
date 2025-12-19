/* eslint-disable @angular-eslint/no-output-native,@angular-eslint/no-output-on-prefix */
import { NgClass } from '@angular/common';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  numberAttribute,
  output,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import { drawerAnimations } from '../animation';
import { StoDrawerFooterComponent } from './sto-drawer-footer.component';
import { StoDrawerHeaderComponent } from './sto-drawer-header.component';

/**
 * A sidebar navigation commonly referred as a drawer that animates from the left or right side of the viewport.
 */
@Component({
  selector: 'sto-drawer',
  templateUrl: './sto-drawer.component.html',
  styleUrl: './sto-drawer.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: drawerAnimations,
  imports: [NgClass],
  host: {
    '[style.width]': 'width()',
    '[style.height.vh]': '100',
    '[class.open]': 'open()',
  },
})
export class StoDrawerComponent {
  private readonly el = inject(ElementRef);

  /**
   * Offset (space) between the viewPanel right and the drawer in pixels
   * Binds to the right style property.
   * Used for multiple drawers where the offset would be the widht of the allready opened drawer.
   * Default 0.
   */
  readonly offset = input(0, { transform: numberAttribute });
  /**
   * Offset (space) between the viewPanel top and the drawer in pixels.
   * Binds to the top style property.
   * Default 0.
   */
  readonly padding = input(0, { transform: numberAttribute });
  /**
   * Position of the drawer as a string
   * Left or right. Default right.
   */
  readonly position = input<'left' | 'right'>('left');
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
   * The width of the drawer in as a string (pixels: '600px', percentage: '33%', or viewPort:'30vw')
   * Default '25vw'
   */
  width = input('300px');
  readonly animation = input(true, { transform: booleanAttribute });
  readonly backdrop = input(false, { transform: booleanAttribute });
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
  readonly headerRef = viewChild<ElementRef>('header');
  readonly footer = contentChild(StoDrawerFooterComponent, {
    read: ElementRef,
    descendants: true,
  });
  readonly headerChild = contentChild(StoDrawerHeaderComponent, {
    read: ElementRef,
    descendants: true,
  });

  readonly slideInOut = computed(() => {
    if (!this.animation()) {
      return this.open()
        ? 'openImmediate'
        : `closedImmediate-${this.position()}`;
    }
    return this.open()
      ? `open-${this.position()}`
      : `closed-${this.position()}`;
  });

  /**
   * If the drawer is opened.
   */
  readonly open = model(false);

  constructor() {
    // Resize content when drawer opens or relevant properties change
    effect(() => {
      if (this.open()) {
        this.resizeContent();
      }
    });

    // Initial resize after render
    afterNextRender(() => {
      this.resizeContent();
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    const path = event.composedPath() as HTMLElement[];
    const isInsideDrawer = path.includes(this.el.nativeElement);

    // Handle Ctrl+Enter for submit
    if (event.ctrlKey && event.key === 'Enter' && isInsideDrawer) {
      this.submit.emit();
      return;
    }

    // Handle Escape key for cancel/close
    if (event.key === 'Escape' && !this.ignoreEscKey()) {
      const isNotInsideAMenu = !this.isAnActiveOverlayPresent();
      if (isNotInsideAMenu) {
        this.closeDrawer();
        this.cancel.emit();
      }
    }
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.resizeContent();
  }

  public toggle(emit = true) {
    if (emit) {
      this.onToggle.emit(!this.open());
    }
    if (!this.open()) {
      this.openDrawer(emit);
    } else {
      this.closeDrawer(emit);
    }
  }

  public closeDrawer(emit = true) {
    this.open.set(false);
    if (emit) {
      this.onClose.emit(true);
    }
  }

  public openDrawer(emit = true) {
    this.open.set(true);
    if (emit) {
      this.onOpen.emit(true);
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
    if (this.open()) {
      const hasFooter = this.footer() != null;
      const totalHeight: number = this.el?.nativeElement.offsetHeight;
      let footerHeight = 0;

      const headerHeight = this.headerRef()?.nativeElement.offsetHeight ?? 0;
      if (hasFooter) {
        footerHeight = this.footer()?.nativeElement?.offsetHeight ?? 0;
      }
      this.height = `${totalHeight - footerHeight - headerHeight}px`;
    }
  }
}
