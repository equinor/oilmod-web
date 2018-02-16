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
import { OverlayOrigin } from '@angular/cdk/overlay';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
  @Input() overlayOrigin: OverlayOrigin;
  @Input() position: 'over' | 'below' = 'over';
  @Input('offsetY') userDefinedOffsetY = 0;
  @Input() offsetX = 0;

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

    Observable.fromEvent(overlayOriginEl, 'click')
      .filter(() => !this.isOpened)
      .takeUntil(this.destroy$)
      .subscribe(() => this.changeState(true));

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) {
  }
}