import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';

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

@Component( {
  selector: 'sto-message-panel',
  templateUrl: './sto-message-panel.component.html',
  styleUrls: [ './sto-message-panel.component.scss' ]
} )
export class StoMessagePanelComponent {

  /**
   * Binds the severity-input to the host elements class
   * TODO: We need to refactor this when possible. Currently the usage disallows class="other-class"
   */
  @HostBinding( 'class' ) @Input() severity: string;
  /**
   * Emits an event on (dismissed) when the user clicks the dismiss icon
   */
  @Output() dismissed = new EventEmitter();
  /**
   * Determines if the message can be dismissed - typically used for showing and hiding errors.
   */
  @Input() dismissable: boolean;
}
