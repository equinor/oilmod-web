import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
  inject,
  input,
  output,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

const COLORS = ['primary', 'accent', 'warning', 'danger', 'success'];

@Component({
  selector: 'sto-message-panel',
  templateUrl: './sto-message-panel.component.html',
  styleUrls: ['./sto-message-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [MatIconModule, MatButtonModule],
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
  private elRef = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly color = input<
    'primary' | 'accent' | 'warning' | 'danger' | 'success'
  >('primary');
  /**
   * @deprecated
   * severity was used to signify behaviour. Now you should use icon + color.
   */
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input()
  severity: 'info' | 'warning' | 'error' = 'info';
  readonly icon = input<'info' | 'warning' | 'error'>('info');
  /**
   * Emits an event on (dismissed) when the user clicks the dismiss icon
   */
  readonly dismissed = output();
  /**
   * Determines if the message can be dismissed - typically used for showing and hiding errors.
   * Default is true
   */
  readonly dismissable = input<boolean>();

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

  ngOnChanges(changes: SimpleChanges): void {
    const el = this.elRef.nativeElement;
    if (changes.color) {
      el.classList.remove(...COLORS.map((c) => `mat-${c}`));
      el.classList.add(`mat-${changes.color.currentValue}`);
    }
    if (changes.dismissable) {
      const dismissable = changes.dismissable.currentValue;
      this.setDismissableClass(dismissable, el);
    }
  }

  ngAfterViewInit(): void {
    const color = this.color();
    this.elRef.nativeElement.classList.add(`mat-${color}`, 'sto-message-panel');
    this.setDismissableClass(
      this.dismissable() != false,
      this.elRef.nativeElement,
    );
  }

  private setDismissableClass(dismissable: boolean, el: HTMLElement) {
    if (dismissable) {
      el.classList.add('sto-message-panel--dismissable');
    } else {
      el.classList.remove('sto-message-panel--dismissable');
    }
  }
}
