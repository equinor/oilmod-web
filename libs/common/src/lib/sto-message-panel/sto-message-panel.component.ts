import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
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
  host: {
    '[class]': 'classStr()',
  },
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
export class StoMessagePanelComponent {
  /**
   * @deprecated
   * severity was used to signify behaviour. Now you should use icon + color.
   */
  readonly severity = input<'info' | 'warning' | 'error'>('info');

  /** Color of the message panel - primary, accent, warning, danger, success */
  readonly color = input<
    'primary' | 'accent' | 'warning' | 'danger' | 'success'
  >('primary');

  /** Icon to show on the message panel - info, warning, error, help */
  readonly icon = input<'info' | 'warning' | 'error' | 'help'>('info');

  /** Emits an event on (dismissed) when the user clicks the dismiss icon */
  readonly dismissed = output();

  /** Determines if the message can be dismissed - typically used for showing and hiding errors.*/
  readonly dismissable = input<boolean>();

  // Used to set the component classlist based on inputs
  readonly classStr = computed(() =>
    [
      'sto-message-panel',
      this.icon() || this.severity(),
      `mat-${this.color()}`,
      this.dismissable() != false ? 'sto-message-panel--dismissable' : '',
    ].join(' '),
  );
}
