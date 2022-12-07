import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { HighlightModule } from 'ngx-highlightjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'sto-demo',
  template: `
    <ng-content></ng-content>
    <mat-expansion-panel *ngIf="code"
                         style="margin-bottom: 80px; margin-top: 16px;">
      <mat-expansion-panel-header>
        <mat-panel-title>
          Code
        </mat-panel-title>
      </mat-expansion-panel-header>
      <pre><code [lineNumbers]="true"
                 [highlight]="code"></code></pre>
    </mat-expansion-panel>
  `,
  imports: [
    MatExpansionModule,
    HighlightModule,
    NgIf
  ],
  standalone: true
})
export class DemoComponent {
  @Input()
  code: string;
}
