import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'sto-wysiwyg-actions',
  templateUrl: './wysiwyg-actions.component.html',
  styleUrls: [ './wysiwyg-actions.component.scss' ],
  standalone: true,
  imports: [
    NgIf,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule
  ]
})
export class WysiwygActionsComponent {
  @Input()
  active: string[];
  @Input()
  disabled: boolean;
  @Output()
  modifier = new EventEmitter<string>();
}
