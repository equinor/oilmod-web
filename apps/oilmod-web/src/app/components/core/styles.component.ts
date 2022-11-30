import { Component, ViewEncapsulation } from '@angular/core';
import { NgClass, NgForOf } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  standalone: true,
  selector: 'sto-styles',
  encapsulation: ViewEncapsulation.None,
  // styleUrls: [ './styles.component.scss' ],
  template: `
    <mat-tab-group>
      <mat-tab label="Buttons">
        <mat-card class="sto-card">
          <div *ngFor="let color of colors">
            <mat-card-subtitle class="sto-card__subtitle">
              <h2>{{ color }}</h2>
            </mat-card-subtitle>
            <button mat-button
                    [color]="color">Mat Button
            </button>
            <button mat-stroked-button
                    [color]="color">Mat stroked Button
            </button>
            <button mat-flat-button
                    [color]="color">Mat flat Button
            </button>
            <button mat-raised-button
                    [color]="color">Mat raised Button
            </button>
            <button mat-icon-button
                    [color]="color">
              <mat-icon>home</mat-icon>
            </button>
          </div>
        </mat-card>
      </mat-tab>
      <mat-tab label="Cards">
        <mat-card *ngFor="let c of colors"
                  [ngClass]="'mat-' + c">
          <mat-card-title>{{ c }}</mat-card-title>
        </mat-card>
      </mat-tab>
      <mat-tab label="Text">
        <mat-card class="sto-card">
          <div class="container">
            <div>
              <p *ngFor="let color of colors"
                 [ngClass]="'mat-' + color">&lt;p&gt; {{ color }}</p>
            </div>
            <div>
              <span *ngFor="let color of colors"
                    style="display: block"
                    [ngClass]="'mat-' + color">
                &lt;span&gt; {{ color }}
              </span>
            </div>
            <div>
              <h2 *ngFor="let color of colors"
                  style="display: block"
                  [ngClass]="'mat-' + color">
                &lt;h[1|2|3|4|5]&gt; {{ color }}
              </h2>
            </div>
          </div>
        </mat-card>
      </mat-tab>
    </mat-tab-group>
  `,
  imports: [
    NgClass,
    NgForOf,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class StylesComponent {
  public colors = [ 'primary', 'accent', 'warn', 'warning', 'success', 'danger' ] as Array<ThemePalette>;
}
