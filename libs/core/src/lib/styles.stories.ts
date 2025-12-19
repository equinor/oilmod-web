import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';

@Component({
  selector: 'app-dialog-demo',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <button matButton="filled" (click)="show(standardDialog)">
      Standard Dialog
    </button>
    <button
      matButton="outlined"
      (click)="show(destructiveDialog)"
      style="margin-left: 8px"
    >
      Destructive Dialog
    </button>

    <!-- Standard Dialog Template -->
    <ng-template #standardDialog>
      <h3 mat-dialog-title>Save Changes</h3>
      <mat-dialog-content [class.scroll-lines]="separatorLines">
        <p>Are you sure you want to save these changes?</p>
        <p>This action will update the configuration.</p>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button matButton mat-dialog-close>Cancel</button>
        <button matButton="filled" mat-dialog-close color="primary">
          Save
        </button>
      </mat-dialog-actions>
    </ng-template>

    <!-- Destructive Dialog Template -->
    <ng-template #destructiveDialog>
      <h3 mat-dialog-title>Delete Item</h3>
      <mat-dialog-content [class.scroll-lines]="separatorLines">
        <p>Are you sure you want to delete this item?</p>
        <p><strong>This action cannot be undone.</strong></p>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button matButton mat-dialog-close>Cancel</button>
        <button matButton="outlined" mat-dialog-close color="warn">
          Delete
        </button>
      </mat-dialog-actions>
    </ng-template>
  `,
})
class DialogDemoComponent {
  private dialog = inject(MatDialog);

  @Input()
  separatorLines = false;

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
        CommonModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatProgressSpinnerModule,
        MatTabsModule,
        DialogDemoComponent,
      ],
    }),
  ],
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

type CardArgs = {
  withStyles: boolean;
};

type DialogArgs = {
  separatorLines: boolean;
};

type ThemeArgs = {
  withStyles?: boolean;
} & Record<string, unknown>;

export const StoDialog: StoryObj<DialogArgs> = {
  args: {
    separatorLines: false,
  },
  render: (args: DialogArgs) => ({
    props: { ...args },
    template: `
      <div>
        <h2>Dialog Patterns</h2>
        <p>Click the buttons below to see different dialog patterns:</p>
        <app-dialog-demo [separatorLines]="separatorLines"></app-dialog-demo>

        <div style="margin-top: 24px; padding: 16px; background: #f5f5f5; border-radius: 4px;">
          <h3>Dialog Guidelines:</h3>
          <ul>
            <li>Dialog actions should use text buttons (<code>matButton</code>)</li>
            <li>Exception: Destructive actions can use outlined buttons (<code>matButton="outlined"</code>) with <code>color="warn"</code></li>
            <li>Dialog title should use <code>&lt;h3 mat-dialog-title&gt;</code></li>
            <li>Content should use paragraphs (<code>&lt;p&gt;</code>)</li>
            <li>Standard width is 560px with <code>panelClass: 'sto-dialog'</code></li>
          </ul>
        </div>
      </div>
    `,
  }),
};

export const StoThemeButtons: StoryObj<ThemeArgs> = {
  args: {
    withStyles: true,
  },
  render: (args: ThemeArgs) => ({
    props: {
      ...args,
      colors: ['primary', 'accent', 'warn', 'warning', 'success', 'danger'],
    },
    styles: [
      `
        .color-section {
          padding: 16px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .button-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .button-row ::ng-deep .mdc-button__label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }
        .loading-states {
          display: flex;
          gap: 24px;
          align-items: center;
        }
      `,
    ],
    template: `
<mat-card class="sto-card">
  @for (color of colors; track color) {
    <div class="color-section">
      <mat-card-subtitle class="sto-card__subtitle">
        <h3>{{ color | titlecase }}</h3>
      </mat-card-subtitle>
      <div class="button-row">
        <button matButton="filled" [color]="color">Filled</button>
        <button matButton="outlined" [color]="color">Outlined</button>
        <button matButton [color]="color">Text</button>
        <button matButton="elevated" [color]="color">Elevated</button>
        <button matIconButton [color]="color" aria-label="Home">
          <mat-icon>home</mat-icon>
        </button>
        <button matFab [color]="color" aria-label="Add">
          <mat-icon>add</mat-icon>
        </button>
        <button matMiniFab [color]="color" aria-label="Edit">
          <mat-icon>edit</mat-icon>
        </button>
      </div>
      <div class="button-row">
        <button matButton="filled" [color]="color" disabled>Disabled Filled</button>
        <button matButton="outlined" [color]="color" disabled>Disabled Outlined</button>
        <button matButton [color]="color" disabled>Disabled Text</button>
        <button matIconButton [color]="color" disabled aria-label="Disabled">
          <mat-icon>home</mat-icon>
        </button>
      </div>
      <div class="button-row">
        <button matButton="filled" [color]="color">
          <mat-icon>save</mat-icon>
          With Icon
        </button>
        <button matButton="outlined" [color]="color">
          <mat-icon>download</mat-icon>
          Download
        </button>
      </div>
    </div>
  }
  <mat-card-subtitle class="sto-card__subtitle">
    <h3>Loading States</h3>
  </mat-card-subtitle>
  <div class="loading-states">
    <div style="text-align: center;">
      <mat-spinner [color]="'primary'" [diameter]="40" aria-label="Loading spinner"></mat-spinner>
      <p style="margin-top: 8px;">Spinner</p>
    </div>
    <div class="button-row">
      <button matButton="filled" color="primary" disabled>
        <mat-spinner [diameter]="20" color="primary"></mat-spinner>
        Loading...
      </button>
    </div>
  </div>
</mat-card>
    `,
  }),
};

export const StoThemeCards: StoryObj<ThemeArgs> = {
  args: {
    withStyles: true,
  },
  render: (args: ThemeArgs) => ({
    props: {
      ...args,
      colors: ['primary', 'accent', 'warn', 'warning', 'success', 'danger'],
    },
    styles: [
      `
        .container {
          display: grid;
          gap: 8px;
        }
        .demo-section {
          margin-bottom: 32px;
        }
      `,
    ],
    template: `
<div>
  <div class="demo-section">
    <h3>Basic Card Styling</h3>
    <mat-card [class.sto-card]="withStyles">
      <mat-card-title [class.sto-card__title]="withStyles">
        Card Title
      </mat-card-title>
      <mat-card-subtitle [class.sto-card__subtitle]="withStyles">
        Card Subtitle
      </mat-card-subtitle>
      <mat-card-content [class.sto-card__content]="withStyles">
        <p>Card content goes here. Use the <code>sto-card</code> class to apply Equinor styling.</p>
        <p>Toggle the "withStyles" control to see the difference between styled and unstyled cards.</p>
      </mat-card-content>
    </mat-card>
  </div>

  <div class="demo-section">
    <h3>Color-themed Cards</h3>
    <div class="container">
      @for (c of colors; track c) {
        <mat-card [ngClass]="'mat-' + c">
          <mat-card-header>
            <mat-card-title>{{ c | titlecase }}</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            Card with <code>mat-{{ c }}</code> class applied
          </mat-card-content>
        </mat-card>
      }
    </div>
  </div>
</div>
    `,
  }),
};

export const StoThemeTextColors: StoryObj<ThemeArgs> = {
  args: {
    withStyles: true,
  },
  render: (args: ThemeArgs) => ({
    props: {
      ...args,
      colors: ['primary', 'accent', 'warn', 'warning', 'success', 'danger'],
    },
    styles: [
      `
        .container {
          display: flex;
          gap: 24px;
        }
        .container > div {
          flex: 0 1 auto;
        }
      `,
    ],
    template: `
<mat-card class="sto-card">
  <mat-card-content>
    <div class="container">
      <div>
        <h4>Paragraphs</h4>
        @for (color of colors; track color) {
          <p [ngClass]="'mat-' + color">{{ color | titlecase }} text</p>
        }
      </div>
      <div>
        <h4>Spans</h4>
        @for (color of colors; track color) {
          <div [ngClass]="'mat-' + color"><p>{{ color | titlecase }} text</p></div>
        }
      </div>
      <div>
        <h4>Headings</h4>
        @for (color of colors; track color) {
          <h3 [ngClass]="'mat-' + color">{{ color | titlecase }}</h3>
        }
      </div>
    </div>
  </mat-card-content>
</mat-card>
    `,
  }),
};
