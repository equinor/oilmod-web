import { Component, Input, input, output } from '@angular/core';

import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'sto-wysiwyg-actions',
    templateUrl: './wysiwyg-actions.component.html',
    styleUrls: ['./wysiwyg-actions.component.scss'],
    imports: [
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule
]
})
export class WysiwygActionsComponent {
  readonly active = input<string[]>();
  // TODO: Skipped for migration because:
  //  Your application code writes to the input. This prevents migration.
  @Input()
  disabled: boolean;
  readonly modifier = output<string>();
}
