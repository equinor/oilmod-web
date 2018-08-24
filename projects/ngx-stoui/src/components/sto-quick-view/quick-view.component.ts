import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Subject ,  fromEvent } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { filter, takeUntil } from 'rxjs/operators';

/**
 * QuickViewComponent is a fixed overlay that is anchored to an element.
 * Can be used to display contextual information about an item
 *
 * @example
 *
 * <span cdkOverlayOrigin #origin="cdkOverlayOrigin">Edit item</span>
 * <sto-quick-view [overlayOrigin]="origin" [offsetX]="-8" position="below" #quickView>
 *   <h3 quickViewHeader>{{ item.title }}</h3>
 *   <app-edit-item [item]="item"></app-edit-item>
 *   <div quickViewFooter>
 *     <app-save-footer (save)="save(item)"></app-save-footer>
 *   </div>
 * </sto-quick-view>
 *
 */
@Component({
  selector: 'sto-quick-view',
  templateUrl: './quick-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('transformPanel', [
      state('showing', style({
        opacity: 1
      })),
      transition('void => *', [
        style({
          opacity: 0
        }),
        animate('400ms ease-in')
      ]),
      transition('* => void', [
        animate('400ms ease-out', style({opacity: 0}))
      ])
    ])
  ],
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./quick-view.component.scss']
})
export class QuickViewComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * overlayOrigin contains information about the originating element.
   *
   * @example
   *
   * <span cdkOverlayOrigin #origin="cdkOverlayOrigin">Origin</span>
   * <sto-quick-view [overlayOrigin]="origin" #quickView>...</sto-quick-view>
   */
  @Input() overlayOrigin: CdkOverlayOrigin;
  /**
   * position determing the direction of the overlay (above or below the element).
   * Defaults to 'over'
   *
   * @example
   *
   * <span cdkOverlayOrigin #origin="cdkOverlayOrigin">Origin</span>
   * <sto-quick-view [overlayOrigin]="origin" position="below" #quickView>...</sto-quick-view>
   */
  @Input() position: 'over' | 'below' = 'over';
  /**
   * @type number
   * Determines the overlay offset in px on the X and Y-axis. Defaults to 0.
   *
   * @example
   *
   * <span cdkOverlayOrigin #origin="cdkOverlayOrigin">Origin</span>
   * <sto-quick-view [overlayOrigin]="origin" [offsetY]="12" [offsetX]="12" #quickView>...</sto-quick-view>
   */
  @Input('offsetY') userDefinedOffsetY = 0;
  @Input() offsetX = 0;

  /**
   * Emits an event when the overlay is closed or opened. Used to act on close events.
   *
   * @example
   *
   * <span cdkOverlayOrigin #origin="cdkOverlayOrigin">Origin</span>
   * <sto-quick-view [overlayOrigin]="origin" (opened)="getItem()" (closed)="saveItem()" #quickView>...</sto-quick-view>
   */
  @Output() closed = new EventEmitter();
  @Output() opened = new EventEmitter();

  @ViewChild('dialog') dialog: ElementRef;
  @ViewChild('footer') footer: ElementRef;

  public offsetY: number;
  public isOpened: boolean;
  private destroy$ = new Subject<any>();

  @HostListener('document:click', ['$event'])
  onDocumentClick(event) {
    if (this.dialog) {
      const isOption = event.path.map(el => el.tagName).includes('MAT-OPTION');
      if (isOption) {
        return;
      }
      const overlayOriginEl = this.overlayOrigin.elementRef.nativeElement;
      const btnClicked = overlayOriginEl.contains(event.target);
      const dialogEl = this.dialog.nativeElement;
      let shouldClose = true;
      if (btnClicked) {
        shouldClose = false;
      }
      if (dialogEl.contains(event.target)) {
        const footerEl = this.footer.nativeElement;
        shouldClose = false;
        if (footerEl.contains(event.target)) {
          const el: HTMLElement = event.target;
          shouldClose = Array.from(el.classList).includes('mat-button-wrapper') || Array.from(el.classList).includes('mat-button');
        }
      }
      this.changeState(!shouldClose);
    }

  }

  public close() {
    this.changeState(false);
  }

  public connectedOverlayDetach() {
    this.changeState(false);
  }

  private changeState(isOpened: boolean) {
    this.isOpened = isOpened;
    isOpened ? this.opened.emit() : this.closed.emit();
    this.changeDetectorRef.markForCheck();
  }

  ngAfterViewInit() {
    const el = this.overlayOrigin.elementRef.nativeElement;
    const dims = el.getBoundingClientRect();
    if (this.position === 'over') {
      this.offsetY = -dims.height + this.userDefinedOffsetY;
    } else {
      this.offsetY = 0;
    }
  }

  ngOnInit() {
    const overlayOriginEl = this.overlayOrigin.elementRef.nativeElement;

    fromEvent(overlayOriginEl, 'click')
      .pipe(
        filter(() => !this.isOpened),
        takeUntil(this.destroy$)
      ).subscribe(() => this.changeState(true));

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }
}
