import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { PopoverComponent } from './popover.component';

@Component({
  selector: 'sto-popover-footer',
  standalone: true,
  imports: [ MatDividerModule, MatLegacyButtonModule, MatIconModule ],
  template: `
      <mat-divider></mat-divider>
      <div class="sto-popover-footer">
          <ng-content></ng-content>
      </div>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverFooterComponent {
  public overlay = inject(PopoverComponent);
}
