import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';

const COLORS = [
  'primary', 'accent', 'warning', 'danger', 'success'
];

@Component({
  selector: 'sto-message-panel',
  templateUrl: './sto-message-panel.component.html',
  styleUrls: [ './sto-message-panel.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
/**
 * Message panel to display inline info boxes.
 * Can be of severity warning, error or info.
 *
 * @example
 *
 * <sto-message-panel severity="warning"></sto-message-panel>
 * <sto-message-panel severity="info"></sto-message-panel>
 * <sto-message-panel severity="error"></sto-message-panel>
 * <sto-message-panel *ngIf="err" [dismissable]="true"
 *    (dismissed)="err = null" severity="warning">{{ err }}</sto-message-panel>
 */
export class StoMessagePanelComponent implements OnChanges, AfterViewInit {
  @Input()
  color: 'primary' | 'accent' | 'warning' | 'danger' | 'success' = 'primary';

  @HostBinding('class.warning')
  get warning() {
    return this.severity === 'warning';
  }

  @HostBinding('class.info')
  get info() {
    return this.severity === 'info';
  }

  @HostBinding('class.error')
  get error() {
    return this.severity === 'error';
  }

  /**
   * @deprecated
   * severity was used to signify behaviour. Now you should use icon + color.
   */
  @Input()
  severity: 'info' | 'warning' | 'error' = 'info';
  @Input()
  icon: 'info' | 'warning' | 'error' = 'info';
  /**
   * Emits an event on (dismissed) when the user clicks the dismiss icon
   */
  @Output() dismissed = new EventEmitter();
  /**
   * Determines if the message can be dismissed - typically used for showing and hiding errors.
   */
  @Input() dismissable: boolean;

  constructor(private elRef: ElementRef<HTMLElement>) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    const el = this.elRef.nativeElement;
    if ( changes.color ) {
      el.classList.remove(...COLORS.map(c => `mat-${c}`));
      el.classList.add(`mat-${changes.color.currentValue}`);
    }
    if ( changes.dismissable ) {
      const dismissable = changes.dismissable.currentValue;
      this.setDismissableClass(dismissable, el);
    }
  }

  private setDismissableClass(dismissable: boolean, el: HTMLElement) {
    if ( dismissable ) {
      el.classList.add('sto-message-panel--dismissable');
    } else {
      el.classList.remove('sto-message-panel--dismissable');
    }
  }

  ngAfterViewInit(): void {
    const color = this.color;
    this.elRef.nativeElement.classList.add(`mat-${color}`, 'sto-message-panel');
    this.setDismissableClass(this.dismissable, this.elRef.nativeElement);
  }
}
