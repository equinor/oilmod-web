import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Renderer2,
  ViewEncapsulation,
  effect,
  inject,
  input,
  model,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/**
 * The action footer is a fixed footer at the bottom of the viewport.
 * Should be used with buttons with actions like "Save, cancel etc.
 * Has a built-in loading/progress bar.
 */
@Component({
  selector: 'sto-action-footer',
  templateUrl: './sto-action-footer.component.html',
  styleUrl: './sto-action-footer.component.scss',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatProgressBarModule,
  ],
  host: {
    '[style.position]': 'position()',
    class: 'sto-action-footer',
  },
})
export class StoActionFooterComponent {
  private readonly renderer = inject(Renderer2);
  private readonly destroyRef = inject(DestroyRef);

  /**
   * Triggers if the progressbar should be visible or not.
   */
  readonly isLoading = model(false);

  /**
   * If a class "sto-has-action-footer" should be appended to the body-tag.
   * This is used to calculate correct height by adding padding to the body element as the footer is a fixed element.
   * Default true.
   */
  readonly shouldAddClass = input(true);

  /**
   * Controls the position style. Defaults to "fixed", but could be absolute inside a relative container.
   */
  readonly position = input('fixed');

  constructor() {
    // Manage body class based on shouldAddClass input
    effect(() => {
      if (this.shouldAddClass()) {
        this.renderer.addClass(document.body, 'sto-has-action-footer');
      }
    });

    // Cleanup body class on destroy
    this.destroyRef.onDestroy(() => {
      if (this.shouldAddClass()) {
        this.renderer.removeClass(document.body, 'sto-has-action-footer');
      }
    });
  }
}
