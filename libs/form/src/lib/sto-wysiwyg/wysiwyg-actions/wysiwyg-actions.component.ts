import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'sto-wysiwyg-actions',
  templateUrl: './wysiwyg-actions.component.html',
  styleUrl: './wysiwyg-actions.component.scss',
  imports: [MatButtonToggleModule, MatIconModule, MatButtonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WysiwygActionsComponent {
  readonly active = input<string[]>();
  readonly disabled = input<boolean>(false);
  readonly modifier = output<string>();
}
