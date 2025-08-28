import { Component, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { HighlightModule } from 'ngx-highlightjs';

@Component({
  selector: 'sto-demo',
  template: `
    <ng-content></ng-content>
    @if (code) {
      <mat-expansion-panel style="margin-bottom: 80px; margin-top: 16px;">
        <mat-expansion-panel-header>
          <mat-panel-title> Code </mat-panel-title>
        </mat-expansion-panel-header>
        <pre><code lineNumbers [highlightAuto]="code"></code></pre>
      </mat-expansion-panel>
    }
  `,
  imports: [MatExpansionModule, HighlightModule],
})
export class DemoComponent {
  // TODO: Skipped for migration because:
  //  This input is used in a control flow expression (e.g. `@if` or `*ngIf`)
  //  and migrating would break narrowing currently.
  @Input()
  code: string;
}
