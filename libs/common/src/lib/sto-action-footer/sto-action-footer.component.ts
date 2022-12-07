import { ChangeDetectionStrategy, Component, HostBinding, Input, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';

/**
 * The action footer is a fixed footer at the bottom of the viewport.
 * Should be used with buttons with actions like "Save, cancel etc.
 * Has a built-in loading/progress bar.
 */
@Component({
  selector: 'sto-action-footer',
  templateUrl: './sto-action-footer.component.html',
  styleUrls: [ './sto-action-footer.component.scss' ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ MatIconModule, MatButtonModule, MatButtonToggleModule, MatProgressBarModule, NgIf ],
})
export class StoActionFooterComponent implements OnInit, OnDestroy {
  /**
   * Triggers if the progressbar should be visible or not.
   */
  @Input() isLoading: boolean;
  /**
   * If a class "sto-has-action-footer" should be appended to the body-tag.
   * This is used to calculate correct height by adding padding to the body element as the footer is a fixed element.
   * Default true.
   */
  @Input() shouldAddClass = true;
  /**
   * Hostbinds to style.position. Defaults to "fixed", but could be absolute inside a relative container.
   */
  @HostBinding('style.position') @Input() position = 'fixed';
  @HostBinding('class.sto-action-footer')
  private actionFooterClass = true;

  constructor(private renderer: Renderer2) {
  }

  ngOnDestroy(): void {
    if ( this.shouldAddClass ) {
      this.renderer.removeClass(document.body, 'sto-has-action-footer');
    }
  }

  ngOnInit(): void {
    if ( this.shouldAddClass ) {
      this.renderer.addClass(document.body, 'sto-has-action-footer');
    }
  }

}
