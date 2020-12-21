import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-dialog-demo',
  template: `
    <button mat-button
            (click)="show(tmpl)">Show dialog
    </button>
    <ng-template #tmpl>
      <h3 mat-dialog-title>Dialog Title</h3>
      <mat-dialog-content [class.scroll-lines]="separatorLines">
        <ul style="padding-left: 12px">
          <li>Dialog actions should (nearly) always be text-buttons (never raised).</li>
          <ul>
            <li>Exception is e.g to confirm a deletion, in which case you can use "mat-stroked-button" with color="warn"</li>
          </ul>
          <li>Dialog title should always be with an h3 element</li>
          <li>Dialog textual content should always be done using paragraphs (&lt;p&gt;)</li>
        </ul>
        <p>Configuration:</p>
        <code><pre>
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
  </pre>
        </code>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button
                mat-dialog-close>Cancel
        </button>
        <button mat-button
                mat-dialog-close
                color="primary">Save
        </button>
      </mat-dialog-actions>
    </ng-template>
  `
})
class DialogDemoComponent {
  @Input()
  separatorLines: boolean;

  show(tmpl) {
    this.dialog.open(tmpl, {
      width: '560px',
      panelClass: 'sto-dialog'
    });
  }

  constructor(private dialog: MatDialog) {
  }
}

export default {
  title: 'core/Styles',
  decorators: [
    moduleMetadata({
      imports: [ MatCardModule, MatTabsModule, MatDialogModule, CommonModule, BrowserAnimationsModule, MatButtonModule, MatIconModule ],
      declarations: [ DialogDemoComponent ]
    })
  ],
  argTypes: {
    template: { control: { disable: true } }
  }
} as Meta;

export const StoCard: Story<{ withStyles: boolean }> = (args) => ( {
  props: { ...args },
  template: `<mat-card [class.sto-card]="withStyles">
<mat-card-title [class.sto-card__title]="withStyles">Card Title</mat-card-title>
<mat-card-subtitle [class.sto-card__subtitle]="withStyles">Card Subtitle</mat-card-subtitle>
<mat-card-content [class.sto-card__content]="withStyles">Card Content In Here</mat-card-content>
</mat-card>`
} );
StoCard.args = {
  withStyles: true
};

export const StoGrid: Story<{}> = (args) => ( {
  template: `
<div class="sto-grid sto-grid--2" style="margin-bottom: 8px;">
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--2</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--2</div>
</div>
<div class="sto-grid sto-grid--3" style="margin-bottom: 8px;">
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--3</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--3</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--3</div>
</div>
<div class="sto-grid sto-grid--4" style="margin-bottom: 8px;">
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--4</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--4</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--4</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--4</div>
</div>
<div class="sto-grid sto-grid--6" style="margin-bottom: 8px;">
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>
  <div class="sto-grid__column" style="border: 1px solid blue">sto-grid--6</div>
</div>
  `,
} );

export const StoDialog: Story<{}> = (args) => ( {
  props: { ...args },
  template: `<app-dialog-demo [separatorLines]="separatorLines"></app-dialog-demo>`,
} );
StoDialog.args = {
  separatorLines: false
};

export const StoTheme: Story<{}> = args => ( {
  props: { ...args, colors: [ 'primary', 'accent', 'warn', 'warning', 'success', 'danger' ] },
  template: `
  <mat-tab-group>
  <mat-tab label="Buttons">
    <mat-card class="sto-card">
    <div *ngFor="let color of colors">
      <mat-card-subtitle class="sto-card__subtitle">
    <h2>{{ color }}</h2>
</mat-card-subtitle>
    <button mat-button [color]="color">Mat Button</button>
    <button mat-stroked-button [color]="color">Mat stroked Button</button>
    <button mat-flat-button [color]="color">Mat flat Button</button>
    <button mat-raised-button [color]="color">Mat raised Button</button>
    <button mat-icon-button [color]="color"><mat-icon>home</mat-icon></button>
</div>
</mat-card>
  </mat-tab>
  <mat-tab label="Cards">
  <mat-card *ngFor="let c of colors" [ngClass]="'mat-' + c">
  <mat-card-title>{{ c }}</mat-card-title>
</mat-card>
</mat-tab>
</mat-tab-group>
  `,
} );
/*StoTheme.argTypes = {
  color: { control: { type: 'select', options: [ 'primary', 'accent', 'warn', 'warning', 'success', 'danger' ] }, defaultValue: 'primary' },
};*/
