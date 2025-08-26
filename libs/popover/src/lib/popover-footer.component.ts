import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { PopoverComponent } from './popover.component';

@Component({
    selector: 'sto-popover-footer',
    imports: [MatDividerModule, MatButtonModule, MatIconModule],
    template: `
    <mat-divider></mat-divider>
    <div class="sto-popover-footer">
      <ng-content></ng-content>
    </div>
  `,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopoverFooterComponent {
  public overlay = inject(PopoverComponent);
}
