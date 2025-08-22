import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
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
  selector: 'sto-popover-title',
  standalone: true,
  imports: [
    OverlayModule,
    CommonModule,
    MatDividerModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="sto-popover-title">
      <h3>
        <ng-content></ng-content>
      </h3>
      <button mat-icon-button (click)="overlay.trigger.close()">
        <mat-icon>close</mat-icon>
      </button>
    </div>
    <mat-divider></mat-divider>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverTitleComponent {
  public overlay = inject(PopoverComponent);
}
