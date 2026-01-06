import {
  ConnectionPositionPair,
  NoopScrollStrategy,
  OverlayModule,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewEncapsulation,
  input,
  output,
} from '@angular/core';
import { PopoverDirective } from './popover.directive';

const svg = ``;

@Component({
  selector: 'sto-popover',
  imports: [OverlayModule, CommonModule],
  template: ` <ng-template
    cdkConnectedOverlay
    (backdropClick)="trigger().close()"
    [cdkConnectedOverlayHasBackdrop]="hasBackdrop()"
    [cdkConnectedOverlayPositions]="positions"
    [cdkConnectedOverlayMinWidth]="minWidth()"
    [cdkConnectedOverlayMinHeight]="minHeight()"
    [cdkConnectedOverlayBackdropClass]="backdropClass()"
    [cdkConnectedOverlayPanelClass]="panelClass()"
    [cdkConnectedOverlayViewportMargin]="viewportMargin()"
    [cdkConnectedOverlayScrollStrategy]="scrollStrategy()"
    [cdkConnectedOverlayDisableClose]="disableClose()"
    [cdkConnectedOverlayOrigin]="trigger()"
    [cdkConnectedOverlayOpen]="(trigger().openStream | async) === true"
  >
    <div class="sto-popover mat-elevation-z5" style="margin-top: 6px">
      <div class="sto-popover-arrow">
        <svg class="arrow-svg">
          <path
            d="M0.504838 4.86885C-0.168399 4.48524 -0.168399 3.51476 0.504838 3.13115L6 8.59227e-08L6 8L0.504838 4.86885Z"
          ></path>
        </svg>
      </div>
      <ng-content select="sto-popover-title"></ng-content>
      <ng-content></ng-content>
      <ng-content select="[stoPopoverFooter]"></ng-content>
    </div>
  </ng-template>`,
  styleUrl: './popover.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent {
  public positions = [
    new ConnectionPositionPair(
      { originX: 'center', originY: 'bottom' },
      { overlayX: 'center', overlayY: 'top' },
    ),
    new ConnectionPositionPair(
      { originX: 'center', originY: 'top' },
      { overlayX: 'center', overlayY: 'bottom' },
    ),
  ];

  readonly backdropClick = output<void>();
  readonly trigger = input.required<PopoverDirective>();
  readonly minWidth = input<number | string>('200px');
  readonly minHeight = input<number | string>('100px');
  readonly backdropClass = input<string | string[]>(['sto-popover-backdrop']);
  readonly panelClass = input<string | string[]>('sto-popover-panel');
  readonly viewportMargin = input<number>(0);
  readonly scrollStrategy = input<ScrollStrategy>(new NoopScrollStrategy());
  readonly disableClose = input<boolean>(false);
  readonly hasBackdrop = input(true);

  @HostListener('document:keypress', ['$event'])
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.trigger().close();
    }
  }
}
