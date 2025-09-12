import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

@Component({
  selector: 'app-dialog-demo',
  template: `
    <button mat-button (click)="show(tmpl)">Show dialog</button>
    <ng-template #tmpl>
      <h3 mat-dialog-title>Dialog Title</h3>
      <mat-dialog-content [class.scroll-lines]="separatorLines">
        <ul style="padding-left: 12px">
          <li>
            Dialog actions should (nearly) always be text-buttons (never
            raised).
          </li>
          <ul>
            <li>
              Exception is e.g to confirm a deletion, in which case you can use
              "mat-stroked-button" with color="warn"
            </li>
          </ul>
          <li>Dialog title should always be with an h3 element</li>
          <li>
            Dialog textual content should always be done using paragraphs
            (&lt;p&gt;)
          </li>
        </ul>
        <p>Configuration:</p>
        <code>
          <pre>
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '560px';
    dialogConfig.panelClass = 'sto-dialog';
    @NgModule(
        ...,
    providers: [
          {{ '{' }}
          provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: dialogConfig
          {{ '}' }}],
    ...
    )
    export class AppModule...
  </pre
          >
        </code>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close>Cancel</button>
        <button mat-button mat-dialog-close color="primary">Save</button>
      </mat-dialog-actions>
    </ng-template>
  `,
})
class DialogDemoComponent {
  private dialog = inject(MatDialog);

  @Input()
  separatorLines: boolean;

  show(tmpl: TemplateRef<unknown>) {
    this.dialog.open(tmpl, {
      width: '560px',
      panelClass: 'sto-dialog',
    });
  }
}

const meta: Meta = {
  title: 'core/Styles',
  decorators: [
    moduleMetadata({
      imports: [
        MatCardModule,
        MatTabsModule,
        MatDialogModule,
        CommonModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule,
        DialogDemoComponent,
      ],
    }),
  ],
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

type CardArgs = { withStyles: boolean };
type DialogArgs = { separatorLines: boolean };
type ThemeArgs = { withStyles?: boolean } & Record<string, unknown>;

export const StoCard: StoryObj<CardArgs> = {
  args: { withStyles: true },
  render: (args: CardArgs) => ({
    props: { ...args },
    template: `<mat-card [class.sto-card]="withStyles">
<mat-card-title [class.sto-card__title]="withStyles">Card Title</mat-card-title>
<mat-card-subtitle [class.sto-card__subtitle]="withStyles">Card Subtitle</mat-card-subtitle>
<mat-card-content [class.sto-card__content]="withStyles">Card Content In Here</mat-card-content>
</mat-card>`,
  }),
};

export const StoDialog: StoryObj<DialogArgs> = {
  args: { separatorLines: false },
  render: (args: DialogArgs) => ({
    props: { ...args },
    template: `<app-dialog-demo [separatorLines]="separatorLines"></app-dialog-demo>`,
  }),
};

export const StoTheme: StoryObj<ThemeArgs> = {
  args: { withStyles: true },
  render: (args: ThemeArgs) => ({
    props: {
      ...args,
      colors: ['primary', 'accent', 'warn', 'warning', 'success', 'danger'],
    },
    styles: [
      `
      .container { display: flex; }
      .container > div {
       flex: 0 1 auto;
       padding-left: 16px;
       }
      `,
    ],
    template: `
  <mat-tab-group>
  <mat-tab label="Buttons">
    <mat-card class="sto-card">
    @for (color of colors; track color) {
      <div>
        <mat-card-subtitle class="sto-card__subtitle">
          <h2>{{ color }}</h2>
        </mat-card-subtitle>
        <button mat-button [color]="color">Mat Button</button>
        <button mat-stroked-button [color]="color">Mat stroked Button</button>
        <button mat-flat-button [color]="color">Mat flat Button</button>
        <button mat-raised-button [color]="color">Mat raised Button</button>
        <button mat-icon-button [color]="color"><mat-icon>home</mat-icon></button>
      </div>
    }
    </mat-card>
  </mat-tab>
  <mat-tab label="Cards">
    @for (c of colors; track c) {
      <mat-card [ngClass]="'mat-' + c">
        <mat-card-title>{{ c }}</mat-card-title>
      </mat-card>
    }
  </mat-tab>
  <mat-tab label="Text">
    <mat-card class="sto-card">
      <div class="container">
        <div>
          @for (color of colors; track color) {
            <p [ngClass]="'mat-' + color">&lt;p&gt; {{ color }}</p>
          }
        </div>
        <div>
          @for (color of colors; track color) {
            <span style="display: block" [ngClass]="'mat-' + color">
              &lt;span&gt; {{ color }}
            </span>
          }
        </div>
        <div>
          @for (color of colors; track color) {
            <h2 style="display: block" [ngClass]="'mat-' + color">
              &lt;h2&gt; {{ color }}
            </h2>
          }
        </div>
      </div>
    </mat-card>
  </mat-tab>
</mat-tab-group>
    `,
  }),
};
/*StoTheme.argTypes = {
  color: { control: { type: 'select', options: [ 'primary', 'accent', 'warn', 'warning', 'success', 'danger' ] }, defaultValue: 'primary' },
};*/
