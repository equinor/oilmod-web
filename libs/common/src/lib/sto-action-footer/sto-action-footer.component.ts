import { ChangeDetectionStrategy, Component, HostBinding, Input, OnDestroy, OnInit, Renderer2, ViewEncapsulation, inject, input } from '@angular/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressBarModule } from '@angular/material/progress-bar';

/**
 * The action footer is a fixed footer at the bottom of the viewport.
 * Should be used with buttons with actions like "Save, cancel etc.
 * Has a built-in loading/progress bar.
 */
@Component({
    selector: 'sto-action-footer',
    templateUrl: './sto-action-footer.component.html',
    styleUrls: ['./sto-action-footer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatIconModule, MatButtonModule, MatButtonToggleModule, MatProgressBarModule]
})
export class StoActionFooterComponent implements OnInit, OnDestroy {
  private renderer = inject(Renderer2);

  /**
   * Triggers if the progressbar should be visible or not.
   */
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input() isLoading: boolean;
  /**
   * If a class "sto-has-action-footer" should be appended to the body-tag.
   * This is used to calculate correct height by adding padding to the body element as the footer is a fixed element.
   * Default true.
   */
  readonly shouldAddClass = input(true);
  /**
   * Hostbinds to style.position. Defaults to "fixed", but could be absolute inside a relative container.
   */
  // TODO: Skipped for migration because:
  //  This input is used in combination with `@HostBinding` and migrating would
  //  break.
  @HostBinding('style.position') @Input() position = 'fixed';
  @HostBinding('class.sto-action-footer')
  private actionFooterClass = true;

  ngOnDestroy(): void {
    if ( this.shouldAddClass() ) {
      this.renderer.removeClass(document.body, 'sto-has-action-footer');
    }
  }

  ngOnInit(): void {
    if ( this.shouldAddClass() ) {
      this.renderer.addClass(document.body, 'sto-has-action-footer');
    }
  }

}
